import { Request, Response, NextFunction } from 'express';
import bankService from './bank.service';
import {
  generateAccountsSchema,
  generateTransactionsSchema,
  transferSchema,
  createCardSchema,
  createLoanSchema
} from './bank.schemas';
import HttpException from '../../core/errors/http-exception';

export const generateAccounts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const input = generateAccountsSchema.parse(req.body);
    const accounts = await bankService.generateAccounts(input);
    res.status(201).json({
      message: `${accounts.length} accounts created successfully`,
      data: accounts
    });
  } catch (error) {
    next(error);
  }
};

export const generateTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const input = generateTransactionsSchema.parse(req.body);
    const transactions = await bankService.generateTransactions(input);
    res.status(201).json({
      message: `${transactions.length} transactions created successfully`,
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

export const createTransfer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const input = transferSchema.parse(req.body);
    const result = await bankService.createTransfer(input);
    res.status(201).json({
      message: 'Transfer completed successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const input = createCardSchema.parse(req.body);
    const card = await bankService.createCard(input);
    res.status(201).json({
      message: 'Card created successfully',
      data: card
    });
  } catch (error) {
    next(error);
  }
};

export const createLoan = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const input = createLoanSchema.parse(req.body);
    const loan = await bankService.createLoan(input);
    res.status(201).json({
      message: 'Loan created successfully',
      data: loan
    });
  } catch (error) {
    next(error);
  }
};

export const getCardsByAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accountId = parseInt(req.params.accountId);
    if (isNaN(accountId)) {
      throw new HttpException(400, 'Invalid account ID');
    }
    const cards = await bankService.getCardsByAccount(accountId);
    res.json({
      message: 'Cards retrieved successfully',
      data: cards
    });
  } catch (error) {
    next(error);
  }
};

export const getLoansByAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accountId = parseInt(req.params.accountId);
    if (isNaN(accountId)) {
      throw new HttpException(400, 'Invalid account ID');
    }
    const loans = await bankService.getLoansByAccount(accountId);
    res.json({
      message: 'Loans retrieved successfully',
      data: loans
    });
  } catch (error) {
    next(error);
  }
};

export const resetAllData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await bankService.resetAllData();
    res.json(result);
  } catch (error) {
    next(error);
  }
};
