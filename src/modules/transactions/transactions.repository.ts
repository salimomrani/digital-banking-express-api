import { prisma } from '../../config/db';
import { Transaction } from '../../models/transaction.model';

class TransactionsRepository {
  async listByAccountId(accountId: string): Promise<Transaction[]> {
    const transactions = await prisma.transaction.findMany({
      where: {
        account: {
          accountNumber: accountId
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return transactions.map((t) => ({
      id: t.id.toString(),
      type: t.transactionType as 'credit' | 'debit',
      amount: t.amount.toNumber(),
      label: t.description || '',
      date: t.createdAt.toISOString().slice(0, 10)
    }));
  }
}

export default new TransactionsRepository();
