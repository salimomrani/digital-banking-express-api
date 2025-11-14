import { z } from 'zod';

// Schema for generating mock accounts
export const generateAccountsSchema = z.object({
  count: z.number().min(1).max(50).default(5),
  userId: z.number().optional()
});

// Schema for generating mock transactions
export const generateTransactionsSchema = z.object({
  count: z.number().min(1).max(100).default(10),
  accountId: z.number()
});

// Schema for transfer operations
export const transferSchema = z.object({
  fromAccountId: z.number(),
  toAccountId: z.number(),
  amount: z.number().positive(),
  description: z.string().optional(),
  transferType: z.enum(['sepa', 'international', 'instant']).default('sepa')
});

// Schema for creating mock cards
export const createCardSchema = z.object({
  accountId: z.number(),
  cardType: z.enum(['debit', 'credit', 'virtual']).default('debit'),
  limit: z.number().positive().optional()
});

// Schema for creating mock loans
export const createLoanSchema = z.object({
  accountId: z.number(),
  loanType: z.enum(['personal', 'mortgage', 'auto']),
  amount: z.number().positive(),
  interestRate: z.number().positive().max(20),
  durationMonths: z.number().min(6).max(360)
});

export type GenerateAccountsInput = z.infer<typeof generateAccountsSchema>;
export type GenerateTransactionsInput = z.infer<typeof generateTransactionsSchema>;
export type TransferInput = z.infer<typeof transferSchema>;
export type CreateCardInput = z.infer<typeof createCardSchema>;
export type CreateLoanInput = z.infer<typeof createLoanSchema>;
