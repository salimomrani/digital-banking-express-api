export type TransactionType = 'credit' | 'debit';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  label: string;
  date: string;
}
