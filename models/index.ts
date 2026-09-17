export type ProductStatus = 'Active' | 'Inactive';
export type CustomerVisibility = 'Visible' | 'Hidden';
export type StockTransactionStatus = 'POSTED' | 'DRAFT';
export type StockTransactionType = 'Stock In' | 'Stock Out' | 'Sale' | 'Transfer' | 'Adjustment';
export type SaleStatus = 'DRAFT' | 'POSTED';
export type PaymentMethod = 'Cash' | 'Mobile Money' | 'Card' | 'Bank Transfer' | 'Credit' | 'Other';
export type StockInStatus = 'DRAFT' | 'POSTED';
export type TransferStatus = 'DRAFT' | 'POSTED';

export interface Category {
  id: string;
  name: string;
  productCount: number;
  active: boolean;
}

export interface Location {
  id: string;
  name: string;
  code: string;
  address: string;
  active: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  active: boolean;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  shortDescription: string;
  fullDescription: string;
  landingCost: number;
  sellingPrice: number;
  minimumStock: number;
  unit: 'PCS' | 'SET' | 'BOX';
  status: ProductStatus;
  customerVisibility: CustomerVisibility;
  featured: boolean;
  sortOrder: number;
  imageColor: string;
  imageIcon: string;
}

export interface StockBalance {
  productId: string;
  locationId: string;
  quantity: number;
  reserved: number;
}

export interface StockTransaction {
  id: string;
  type: StockTransactionType;
  status: StockTransactionStatus;
  productId: string;
  quantity: number;
  locationId: string;
  toLocationId?: string;
  reference: string;
  user: string;
  createdAt: string;
  note?: string;
}

export interface SaleLine {
  id: string;
  productId: string;
  quantity: number;
  unit: Product['unit'];
  sellingPrice: number;
  discount: number;
}

export interface Sale {
  id: string;
  saleNumber: string;
  date: string;
  locationId: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: PaymentMethod;
  paymentReference: string;
  remarks: string;
  status: SaleStatus;
  lines: SaleLine[];
  createdAt: string;
}

export interface StockInLine {
  id: string;
  productId: string;
  quantity: number;
  unit: Product['unit'];
  unitCost: number;
}

export interface StockInRecord {
  id: string;
  stockInNumber: string;
  date: string;
  supplierId: string;
  supplierReference: string;
  locationId: string;
  remarks: string;
  status: StockInStatus;
  lines: StockInLine[];
  createdAt: string;
}

export interface TransferLine {
  id: string;
  productId: string;
  quantity: number;
  unit: Product['unit'];
}

export interface TransferRecord {
  id: string;
  transferNumber: string;
  date: string;
  fromLocationId: string;
  toLocationId: string;
  remarks: string;
  status: TransferStatus;
  lines: TransferLine[];
  createdAt: string;
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
}

export interface SalesRecord {
  id: string;
  item: string;
  amount: number;
  channel: string;
  time: string;
}