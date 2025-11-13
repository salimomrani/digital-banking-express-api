import { z } from 'zod';

export const accountIdParamSchema = z.object({
  accountId: z.string().min(1)
});

export const transactionPayloadSchema = z.object({
  type: z.enum(['credit', 'debit']),
  amount: z.number().positive(),
  label: z.string().min(1).max(100).optional()
});

export type TransactionPayload = z.infer<typeof transactionPayloadSchema>;
