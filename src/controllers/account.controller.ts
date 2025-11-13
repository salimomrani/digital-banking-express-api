import { Request, Response } from 'express';
import accounts, { Account, Transaction, TransactionType } from '../data/accounts';

const VALID_TRANSACTION_TYPES: TransactionType[] = ['credit', 'debit'];

const findAccount = (accountId: string): Account | undefined =>
  accounts.find((account) => account.id === accountId);

export const listAccounts = (_req: Request, res: Response): Response => {
  return res.json({ accounts });
};

export const getAccountById = (req: Request, res: Response): Response => {
  const account = findAccount(req.params.accountId);

  if (!account) {
    return res.status(404).json({ message: 'Compte introuvable' });
  }

  return res.json({ account });
};

type TransactionPayload = {
  type?: TransactionType;
  amount?: number;
  label?: string;
};

export const createTransaction = (req: Request, res: Response): Response => {
  const account = findAccount(req.params.accountId);

  if (!account) {
    return res.status(404).json({ message: 'Compte introuvable' });
  }

  const payload = (req.body ?? {}) as TransactionPayload;
  const { type, amount, label } = payload;

  if (!type || !VALID_TRANSACTION_TYPES.includes(type)) {
    return res.status(400).json({ message: "Le type doit être 'credit' ou 'debit'" });
  }

  if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Le montant doit être un nombre positif' });
  }

  const transaction: Transaction = {
    id: `TRX-${Date.now()}`,
    type,
    amount,
    label: label || 'Transaction',
    date: new Date().toISOString().slice(0, 10)
  };

  if (type === 'credit') {
    account.balance += amount;
  } else {
    if (amount > account.balance) {
      return res.status(400).json({ message: 'Solde insuffisant' });
    }
    account.balance -= amount;
  }

  account.transactions.unshift(transaction);

  return res.status(201).json({
    message: 'Transaction enregistrée',
    account: {
      id: account.id,
      balance: account.balance,
      currency: account.currency
    },
    transaction
  });
};
