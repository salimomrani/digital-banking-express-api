import { z } from 'zod';

export const accountIdParamSchema = z.object({
  accountId: z.string().min(1)
});

export const accountTransactionSchema = z.object({
  type: z.enum(['credit', 'debit']),
  amount: z.number().positive(),
  label: z.string().min(1).max(100).optional()
});

export type AccountTransactionInput = z.infer<typeof accountTransactionSchema>;
