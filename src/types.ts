export type TransactionType = 'income' | 'expense';

export interface SubCategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType; // 'income' or 'expense'
  subCategories: SubCategory[];
  color?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string; // ISO string
  description: string;
  categoryId: string;
  subCategoryId?: string;
  type: TransactionType;
}

export interface Budget {
  month: string; // YYYY-MM
  amount: number;
}

export interface AppState {
  transactions: Transaction[];
  categories: Category[];
  budgets: Record<string, number>; // Key: YYYY-MM, Value: Amount
}
