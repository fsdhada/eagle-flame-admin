import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { locations, products, stockBalances as initialBalances, stockTransactions as initialTransactions, recentSales, suppliers } from '@/mock/data';
import type { Sale, SaleLine, StockBalance, StockInLine, StockInRecord, StockTransaction, TransferLine, TransferRecord } from '@/models';
import { applyPostedSale, applyPostedStockIn, applyPostedStockOut, applyPostedTransfer, getStockForBalance } from '@/services/mockLedger';

interface MockStoreValue {
  isLoading: boolean;
  balances: StockBalance[];
  stockTransactions: StockTransaction[];
  sales: Sale[];
  stockIns: StockInRecord[];
  transfers: TransferRecord[];
  getStock: (productId: string, locationId: string) => number;
  getTotalStock: (productId: string) => number;
  saveDraftSale: (input: Omit<Sale, 'id' | 'saleNumber' | 'status' | 'createdAt'>) => Promise<Sale>;
  postSale: (input: Omit<Sale, 'id' | 'saleNumber' | 'status' | 'createdAt'>) => Promise<Sale>;
  saveDraftStockIn: (input: Omit<StockInRecord, 'id' | 'stockInNumber' | 'status' | 'createdAt'>) => Promise<StockInRecord>;
  postStockIn: (input: Omit<StockInRecord, 'id' | 'stockInNumber' | 'status' | 'createdAt'>) => Promise<StockInRecord>;
  saveDraftTransfer: (input: Omit<TransferRecord, 'id' | 'transferNumber' | 'status' | 'createdAt'>) => Promise<TransferRecord>;
  postTransfer: (input: Omit<TransferRecord, 'id' | 'transferNumber' | 'status' | 'createdAt'>) => Promise<TransferRecord>;
  postStockOut: (input: { productId: string; locationId: string; quantity: number; reference: string; note: string }) => Promise<void>;
}

const STORAGE_KEY = 'eagle-flame-admin-mock-store-v2';
const StoreContext = createContext<MockStoreValue | undefined>(undefined);

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const today = () => new Date().toISOString().slice(0, 10);
const nowLabel = () => 'Just now';
const nextNumber = (prefix: string, values: string[], fallback = 1) => {
  const largest = values.reduce((max, value) => {
    const match = value.match(new RegExp(`^${prefix}-(\\d+)$`));
    return Math.max(max, match ? Number(match[1]) : 0);
  }, fallback - 1);
  return `${prefix}-${String(largest + 1).padStart(4, '0')}`;
};

const toSale = (sale: Sale): Sale => ({ ...sale, lines: sale.lines.map((line) => ({ ...line })) });

export function MockStoreProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [balances, setBalances] = useState<StockBalance[]>(initialBalances.map((item) => ({ ...item })));
  const [stockTransactions, setStockTransactions] = useState<StockTransaction[]>(initialTransactions.map((item) => ({ ...item })));
  const [sales, setSales] = useState<Sale[]>(recentSales.map((item, index) => ({
    id: item.id,
    saleNumber: `SAL-${String(index + 1).padStart(4, '0')}`,
    date: today(),
    locationId: item.channel === 'Showroom' ? 'loc-showroom' : 'loc-warehouse',
    customerName: index === 0 ? 'Walk-in Customer' : index === 1 ? 'Website Customer' : 'Martha Banda',
    customerPhone: '',
    paymentMethod: index === 1 ? 'Mobile Money' : 'Cash',
    paymentReference: '',
    remarks: '',
    status: 'POSTED',
    lines: [{ id: `${item.id}-line`, productId: products[index].id, quantity: index === 1 ? 2 : 1, unit: products[index].unit, sellingPrice: item.amount / (index === 1 ? 2 : 1), discount: 0 }],
    createdAt: item.time,
  })));
  const [stockIns, setStockIns] = useState<StockInRecord[]>([]);
  const [transfers, setTransfers] = useState<TransferRecord[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Partial<Pick<MockStoreValue, 'balances' | 'stockTransactions' | 'sales' | 'stockIns' | 'transfers'>>;
          if (parsed.balances) setBalances(parsed.balances);
          if (parsed.stockTransactions) setStockTransactions(parsed.stockTransactions);
          if (parsed.sales) setSales(parsed.sales);
          if (parsed.stockIns) setStockIns(parsed.stockIns);
          if (parsed.transfers) setTransfers(parsed.transfers);
        } catch {
          // Keep the safe initial mock dataset when persisted data is malformed.
        }
      }
    }).finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (isLoading) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ balances, stockTransactions, sales, stockIns, transfers }));
  }, [balances, isLoading, sales, stockIns, stockTransactions, transfers]);

  const getStock = useCallback((productId: string, locationId: string) => getStockForBalance(balances, productId, locationId), [balances]);
  const getTotalStock = useCallback((productId: string) => balances.filter((balance) => balance.productId === productId).reduce((sum, balance) => sum + balance.quantity, 0), [balances]);

  const saveDraftSale = useCallback(async (input: Omit<Sale, 'id' | 'saleNumber' | 'status' | 'createdAt'>) => {
    const sale: Sale = { ...input, id: createId('sale'), saleNumber: nextNumber('SAL', sales.map((item) => item.saleNumber), 1), status: 'DRAFT', createdAt: nowLabel() };
    setSales((current) => [sale, ...current]);
    return toSale(sale);
  }, [sales]);

  const postSale = useCallback(async (input: Omit<Sale, 'id' | 'saleNumber' | 'status' | 'createdAt'>) => {
    input.lines.forEach((line) => {
      if (line.quantity > getStock(line.productId, input.locationId)) throw new Error('One or more sale quantities exceed available stock.');
    });
    const sale: Sale = { ...input, id: createId('sale'), saleNumber: nextNumber('SAL', sales.map((item) => item.saleNumber), 1), status: 'POSTED', createdAt: nowLabel() };
    setSales((current) => [sale, ...current]);
    const ledger: { balances: StockBalance[]; stockTransactions: StockTransaction[] } = { balances: balances.map((item) => ({ ...item })), stockTransactions: [...stockTransactions] };
    applyPostedSale(ledger, sale);
    setBalances(ledger.balances);
    setStockTransactions(ledger.stockTransactions);
    return toSale(sale);
  }, [balances, getStock, sales, stockTransactions]);

  const saveDraftStockIn = useCallback(async (input: Omit<StockInRecord, 'id' | 'stockInNumber' | 'status' | 'createdAt'>) => {
    const record: StockInRecord = { ...input, id: createId('stock-in'), stockInNumber: nextNumber('SI', stockIns.map((item) => item.stockInNumber), 1), status: 'DRAFT', createdAt: nowLabel() };
    setStockIns((current) => [record, ...current]);
    return record;
  }, [stockIns]);

  const postStockIn = useCallback(async (input: Omit<StockInRecord, 'id' | 'stockInNumber' | 'status' | 'createdAt'>) => {
    const record: StockInRecord = { ...input, id: createId('stock-in'), stockInNumber: nextNumber('SI', stockIns.map((item) => item.stockInNumber), 1), status: 'POSTED', createdAt: nowLabel() };
    setStockIns((current) => [record, ...current]);
    const ledger: { balances: StockBalance[]; stockTransactions: StockTransaction[] } = { balances: balances.map((item) => ({ ...item })), stockTransactions: [...stockTransactions] };
    applyPostedStockIn(ledger, record);
    setBalances(ledger.balances);
    setStockTransactions(ledger.stockTransactions);
    return record;
  }, [balances, stockIns, stockTransactions]);

  const saveDraftTransfer = useCallback(async (input: Omit<TransferRecord, 'id' | 'transferNumber' | 'status' | 'createdAt'>) => {
    const record: TransferRecord = { ...input, id: createId('transfer'), transferNumber: nextNumber('TR', transfers.map((item) => item.transferNumber), 1), status: 'DRAFT', createdAt: nowLabel() };
    setTransfers((current) => [record, ...current]);
    return record;
  }, [transfers]);

  const postTransfer = useCallback(async (input: Omit<TransferRecord, 'id' | 'transferNumber' | 'status' | 'createdAt'>) => {
    if (input.fromLocationId === input.toLocationId) throw new Error('From Location and To Location must be different.');
    input.lines.forEach((line) => {
      if (line.quantity > getStock(line.productId, input.fromLocationId)) throw new Error('One or more transfer quantities exceed available stock.');
    });
    const record: TransferRecord = { ...input, id: createId('transfer'), transferNumber: nextNumber('TR', transfers.map((item) => item.transferNumber), 1), status: 'POSTED', createdAt: nowLabel() };
    setTransfers((current) => [record, ...current]);
    const ledger: { balances: StockBalance[]; stockTransactions: StockTransaction[] } = { balances: balances.map((item) => ({ ...item })), stockTransactions: [...stockTransactions] };
    applyPostedTransfer(ledger, record);
    setBalances(ledger.balances);
    setStockTransactions(ledger.stockTransactions);
    return record;
  }, [balances, getStock, stockTransactions, transfers]);

  const postStockOut = useCallback(async (input: { productId: string; locationId: string; quantity: number; reference: string; note: string }) => {
    if (input.quantity > getStock(input.productId, input.locationId)) throw new Error('Stock out quantity exceeds available stock.');
    const ledger: { balances: StockBalance[]; stockTransactions: StockTransaction[] } = { balances: balances.map((item) => ({ ...item })), stockTransactions: [...stockTransactions] };
    applyPostedStockOut(ledger, { ...input, id: createId('txn'), reference: input.reference || `OUT-${Date.now()}`, createdAt: nowLabel() });
    setBalances(ledger.balances);
    setStockTransactions(ledger.stockTransactions);
  }, [balances, getStock, stockTransactions]);

  const value = useMemo<MockStoreValue>(() => ({ isLoading, balances, stockTransactions, sales, stockIns, transfers, getStock, getTotalStock, saveDraftSale, postSale, saveDraftStockIn, postStockIn, saveDraftTransfer, postTransfer, postStockOut }), [balances, getStock, getTotalStock, isLoading, postSale, postStockIn, postStockOut, postTransfer, sales, saveDraftSale, saveDraftStockIn, saveDraftTransfer, stockIns, stockTransactions, transfers]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useMockStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useMockStore must be used within MockStoreProvider');
  return context;
}

export const mockStoreReferenceData = { products, locations, suppliers };