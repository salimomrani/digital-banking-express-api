import { Request, Response } from 'express';
import accountsService from './accounts.service';
import { accountIdParamSchema, accountTransactionSchema } from './accounts.schemas';
import transactionsService from '../transactions/transactions.service';

export const listAccounts = (_req: Request, res: Response): Response => {
  return res.json({ accounts: accountsService.listAccounts() });
};

export const getAccountById = (req: Request, res: Response): Response => {
  const { accountId } = accountIdParamSchema.parse(req.params);
  const account = accountsService.getAccount(accountId);
  return res.json({ account });
};

export const createAccountTransaction = (req: Request, res: Response): Response => {
  const { accountId } = accountIdParamSchema.parse(req.params);
  const payload = accountTransactionSchema.parse(req.body);
  const result = transactionsService.createTransaction(accountId, payload);

  return res.status(201).json({
    message: 'Transaction enregistrée',
    account: {
      id: result.account.id,
      balance: result.account.balance,
      currency: result.account.currency
    },
    transaction: result.transaction
  });
};
