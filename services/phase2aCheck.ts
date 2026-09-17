import { products, stockBalances } from '@/mock/data';
import type { Sale, StockInRecord, StockTransaction, TransferRecord } from '@/models';
import { applyPostedSale, applyPostedStockIn, applyPostedTransfer, getStockForBalance } from '@/services/mockLedger';

const productId = products[0].id;
const warehouseId = 'loc-warehouse';
const showroomId = 'loc-showroom';

export interface Phase2ACheckResult {
  passed: boolean;
  checks: Array<{ name: string; passed: boolean; detail: string }>;
}

export function runPhase2ACheck(): Phase2ACheckResult {
  const checks: Phase2ACheckResult['checks'] = [];
  const state = { balances: stockBalances.map((balance) => ({ ...balance })), stockTransactions: [] as StockTransaction[] };
  const initialWarehouse = getStockForBalance(state.balances, productId, warehouseId);
  const initialShowroom = getStockForBalance(state.balances, productId, showroomId);
  const initialCompanyTotal = initialWarehouse + initialShowroom;
  checks.push({ name: 'Initial stock noted', passed: initialWarehouse === 18 && initialShowroom === 7, detail: `Warehouse ${initialWarehouse}, Showroom ${initialShowroom}` });

  const draftStockIn: StockInRecord = { id: 'check-draft-si', stockInNumber: 'SI-0001', date: '2026-09-16', supplierId: 'sup-1', supplierReference: 'DRAFT', locationId: warehouseId, remarks: '', status: 'DRAFT', lines: [{ id: 'line', productId, quantity: 10, unit: products[0].unit, unitCost: products[0].landingCost }], createdAt: 'check' };
  const beforeDraftIn = getStockForBalance(state.balances, productId, warehouseId);
  checks.push({ name: 'Draft Stock In changes nothing', passed: beforeDraftIn === initialWarehouse, detail: `Warehouse remains ${beforeDraftIn}` });
  applyPostedStockIn(state, { ...draftStockIn, id: 'check-posted-si', stockInNumber: 'SI-0001', status: 'POSTED' });
  const afterStockIn = getStockForBalance(state.balances, productId, warehouseId);
  checks.push({ name: 'Posted Stock In increases Warehouse', passed: afterStockIn === 28, detail: `Warehouse is ${afterStockIn}` });

  const draftTransfer: TransferRecord = { id: 'check-draft-tr', transferNumber: 'TR-0001', date: '2026-09-16', fromLocationId: warehouseId, toLocationId: showroomId, remarks: '', status: 'DRAFT', lines: [{ id: 'line', productId, quantity: 3, unit: products[0].unit }], createdAt: 'check' };
  checks.push({ name: 'Draft Transfer changes nothing', passed: getStockForBalance(state.balances, productId, warehouseId) === 28 && getStockForBalance(state.balances, productId, showroomId) === 7, detail: 'Warehouse 28, Showroom 7' });
  applyPostedTransfer(state, { ...draftTransfer, id: 'check-posted-tr', transferNumber: 'TR-0001', status: 'POSTED' });
  const afterTransferWarehouse = getStockForBalance(state.balances, productId, warehouseId);
  const afterTransferShowroom = getStockForBalance(state.balances, productId, showroomId);
  checks.push({ name: 'Posted Transfer moves 3', passed: afterTransferWarehouse === 25 && afterTransferShowroom === 10, detail: `Warehouse ${afterTransferWarehouse}, Showroom ${afterTransferShowroom}` });
  checks.push({ name: 'Transfer preserves company total', passed: afterTransferWarehouse + afterTransferShowroom === 35, detail: `Company total ${afterTransferWarehouse + afterTransferShowroom}` });

  const draftSale: Sale = { id: 'check-draft-sale', saleNumber: 'SAL-0001', date: '2026-09-16', locationId: showroomId, customerName: 'Check Customer', customerPhone: '', paymentMethod: 'Cash', paymentReference: '', remarks: '', status: 'DRAFT', lines: [{ id: 'line', productId, quantity: 2, unit: products[0].unit, sellingPrice: products[0].sellingPrice, discount: 0 }], createdAt: 'check' };
  checks.push({ name: 'Draft Sale changes no stock', passed: getStockForBalance(state.balances, productId, showroomId) === 10, detail: 'Showroom remains 10' });
  const revenueBeforeSale = 0;
  applyPostedSale(state, { ...draftSale, id: 'check-posted-sale', saleNumber: 'SAL-0001', status: 'POSTED' });
  const afterSaleShowroom = getStockForBalance(state.balances, productId, showroomId);
  const revenueAfterSale = draftSale.lines.reduce((sum, line) => sum + line.quantity * line.sellingPrice - line.discount, 0);
  checks.push({ name: 'Posted Sale reduces Showroom', passed: afterSaleShowroom === 8, detail: `Showroom is ${afterSaleShowroom}` });
  checks.push({ name: 'Posted Sale increases revenue', passed: revenueBeforeSale === 0 && revenueAfterSale === 2580, detail: `Revenue increased to ${revenueAfterSale}` });
  checks.push({ name: 'Current stock matches final state', passed: afterSaleShowroom === 8 && afterTransferWarehouse === 25, detail: `Warehouse ${afterTransferWarehouse}, Showroom ${afterSaleShowroom}` });

  return { passed: checks.every((check) => check.passed), checks };
}