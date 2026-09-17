import type { Sale, StockBalance, StockInRecord, StockTransaction, TransferRecord } from '@/models';

export interface MockLedgerState {
  balances: StockBalance[];
  stockTransactions: StockTransaction[];
}

export function getStockForBalance(balances: StockBalance[], productId: string, locationId: string) {
  return balances.find((balance) => balance.productId === productId && balance.locationId === locationId)?.quantity ?? 0;
}

function changeBalance(state: MockLedgerState, productId: string, locationId: string, delta: number) {
  const index = state.balances.findIndex((balance) => balance.productId === productId && balance.locationId === locationId);
  if (index === -1) {
    state.balances.push({ productId, locationId, quantity: delta, reserved: 0 });
    return;
  }
  state.balances[index] = { ...state.balances[index], quantity: state.balances[index].quantity + delta };
}

export function applyPostedStockIn(state: MockLedgerState, record: StockInRecord) {
  record.lines.forEach((line) => {
    changeBalance(state, line.productId, record.locationId, line.quantity);
    state.stockTransactions.unshift({ id: `${record.id}-in-${line.id}`, type: 'Stock In', status: 'POSTED', productId: line.productId, quantity: line.quantity, locationId: record.locationId, reference: record.stockInNumber, user: 'Sarah M.', createdAt: record.createdAt, note: record.supplierReference });
  });
}

export function applyPostedTransfer(state: MockLedgerState, record: TransferRecord) {
  record.lines.forEach((line) => {
    changeBalance(state, line.productId, record.fromLocationId, -line.quantity);
    changeBalance(state, line.productId, record.toLocationId, line.quantity);
    state.stockTransactions.unshift({ id: `${record.id}-out-${line.id}`, type: 'Transfer', status: 'POSTED', productId: line.productId, quantity: -line.quantity, locationId: record.fromLocationId, toLocationId: record.toLocationId, reference: record.transferNumber, user: 'Sarah M.', createdAt: record.createdAt, note: 'TRANSFER OUT' });
    state.stockTransactions.unshift({ id: `${record.id}-in-${line.id}`, type: 'Transfer', status: 'POSTED', productId: line.productId, quantity: line.quantity, locationId: record.toLocationId, toLocationId: record.fromLocationId, reference: record.transferNumber, user: 'Sarah M.', createdAt: record.createdAt, note: 'TRANSFER IN' });
  });
}

export function applyPostedSale(state: MockLedgerState, sale: Sale) {
  sale.lines.forEach((line) => {
    changeBalance(state, line.productId, sale.locationId, -line.quantity);
    state.stockTransactions.unshift({ id: `${sale.id}-sale-${line.id}`, type: 'Sale', status: 'POSTED', productId: line.productId, quantity: -line.quantity, locationId: sale.locationId, reference: sale.saleNumber, user: 'Sarah M.', createdAt: sale.createdAt, note: `${sale.paymentMethod} sale` });
  });
}

export function applyPostedStockOut(state: MockLedgerState, input: { id: string; productId: string; locationId: string; quantity: number; reference: string; note: string; createdAt: string }) {
  changeBalance(state, input.productId, input.locationId, -input.quantity);
  state.stockTransactions.unshift({ id: input.id, type: 'Stock Out', status: 'POSTED', productId: input.productId, quantity: -input.quantity, locationId: input.locationId, reference: input.reference, user: 'Sarah M.', createdAt: input.createdAt, note: input.note });
}