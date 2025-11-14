import { Request, Response } from 'express';
import transactionsService from './transactions.service';
import { accountIdParamSchema, transactionPayloadSchema } from './transactions.schemas';

export const listTransactions = async (req: Request, res: Response): Promise<Response> => {
  const { accountId } = accountIdParamSchema.parse(req.params);
  const transactions = await transactionsService.listTransactions(accountId);
  return res.json({ transactions });
};

export const createTransaction = async (req: Request, res: Response): Promise<Response> => {
  const { accountId } = accountIdParamSchema.parse(req.params);
  const payload = transactionPayloadSchema.parse(req.body);
  const result = await transactionsService.createTransaction(accountId, payload);

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
