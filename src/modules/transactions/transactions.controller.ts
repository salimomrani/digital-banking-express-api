import { Request, Response } from 'express';
import transactionsService from './transactions.service';
import { accountIdParamSchema, transactionPayloadSchema } from './transactions.schemas';

export const listTransactions = (req: Request, res: Response): Response => {
  const { accountId } = accountIdParamSchema.parse(req.params);
  const transactions = transactionsService.listTransactions(accountId);
  return res.json({ transactions });
};

export const createTransaction = (req: Request, res: Response): Response => {
  const { accountId } = accountIdParamSchema.parse(req.params);
  const payload = transactionPayloadSchema.parse(req.body);
  const result = transactionsService.createTransaction(accountId, payload);

  return res.status(201).json({
    message: 'Transaction enregistrée',
    transaction: result.transaction,
    account: {
      id: result.account.id,
      balance: result.account.balance,
      currency: result.account.currency
    }
  });
};
