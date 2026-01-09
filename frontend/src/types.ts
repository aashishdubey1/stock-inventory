export type UserRole = 'Searcher' | 'StockInCharge' | 'Supervisor';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface StockItem {
  id: string;
  drumNumber?: string;
  itemName: string;
  category: 'cables' | 'non-cables';
  quantity: number;
  location: string;
  godown: 'Godown 1' | 'Godown 2';
  status: 'running' | 'low' | 'depleted';
  make?: string;
  coilCount?: number;
  totalCoils?: number;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'IN' | 'OUT';
  itemName: string;
  quantity: number;
  customer?: string;
  invoice?: string;
  user: string;
}

export type Page =
  | 'login'
  | 'searcher-dashboard'
  | 'stockincharge-dashboard'
  | 'supervisor-dashboard'
  | 'cable-dispatch'
  | 'multi-coil-dispatch'
  | 'non-cable-stockin'
  | 'transaction-history'
  | 'reports'
  | 'edit-transaction';
