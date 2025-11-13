import { Transaction } from './transaction.model';

export interface Account {
  id: string;
  owner: string;
  balance: number;
  currency: string;
  transactions: Transaction[];
}
