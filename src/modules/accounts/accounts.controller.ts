import { Request, Response } from 'express';
import accountsService from './accounts.service';
import { accountIdParamSchema, accountTransactionSchema } from './accounts.schemas';
import transactionsService from '../transactions/transactions.service';

export const listAccounts = async (_req: Request, res: Response): Promise<Response> => {
  const accounts = await accountsService.listAccounts();
  return res.json({ accounts });
};

export const getAccountById = async (req: Request, res: Response): Promise<Response> => {
  const { accountId } = accountIdParamSchema.parse(req.params);
  const account = await accountsService.getAccount(accountId);
  return res.json({ account });
};

export const createAccountTransaction = async (req: Request, res: Response): Promise<Response> => {
  const { accountId } = accountIdParamSchema.parse(req.params);
  const payload = accountTransactionSchema.parse(req.body);
  const result = await transactionsService.createTransaction(accountId, payload);

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
