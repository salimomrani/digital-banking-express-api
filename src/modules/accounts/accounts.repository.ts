import { prisma } from '../../config/db';
import { Account } from '../../models/account.model';
import { Transaction } from '../../models/transaction.model';
import { Prisma } from '@prisma/client';

class AccountsRepository {
  async findAll(): Promise<Account[]> {
    const accounts = await prisma.account.findMany({
      include: {
        user: true,
        transactions: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        id: 'asc'
      }
    });

    return accounts.map((account) => ({
      id: account.accountNumber,
      owner: `${account.user.firstName} ${account.user.lastName}`,
      balance: account.balance.toNumber(),
      currency: account.currency,
      transactions: account.transactions.map((t) => ({
        id: t.id.toString(),
        type: t.transactionType as 'credit' | 'debit',
        amount: t.amount.toNumber(),
        label: t.description || '',
        date: t.createdAt.toISOString().slice(0, 10)
      }))
    }));
  }

  async findById(accountId: string): Promise<Account | undefined> {
    const account = await prisma.account.findUnique({
      where: { accountNumber: accountId },
      include: {
        user: true,
        transactions: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!account) {
      return undefined;
    }

    return {
      id: account.accountNumber,
      owner: `${account.user.firstName} ${account.user.lastName}`,
      balance: account.balance.toNumber(),
      currency: account.currency,
      transactions: account.transactions.map((t) => ({
        id: t.id.toString(),
        type: t.transactionType as 'credit' | 'debit',
        amount: t.amount.toNumber(),
        label: t.description || '',
        date: t.createdAt.toISOString().slice(0, 10)
      }))
    };
  }

  async save(account: Account): Promise<Account> {
    await prisma.account.update({
      where: { accountNumber: account.id },
      data: {
        balance: new Prisma.Decimal(account.balance)
      }
    });

    return account;
  }

  async addTransaction(accountId: string, transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    // Use Prisma transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Get account
      const account = await tx.account.findUnique({
        where: { accountNumber: accountId }
      });

      if (!account) {
        throw new Error('Account not found');
      }

      const currentBalance = account.balance.toNumber();

      // Calculate new balance
      const newBalance = transaction.type === 'credit'
        ? currentBalance + transaction.amount
        : currentBalance - transaction.amount;

      // Create transaction record
      const newTransaction = await tx.transaction.create({
        data: {
          accountId: account.id,
          transactionType: transaction.type,
          amount: new Prisma.Decimal(transaction.amount),
          balanceAfter: new Prisma.Decimal(newBalance),
          description: transaction.label
        }
      });

      // Update account balance
      await tx.account.update({
        where: { id: account.id },
        data: {
          balance: new Prisma.Decimal(newBalance)
        }
      });

      return newTransaction;
    });

    return {
      id: result.id.toString(),
      type: result.transactionType as 'credit' | 'debit',
      amount: result.amount.toNumber(),
      label: result.description || '',
      date: result.createdAt.toISOString().slice(0, 10)
    };
  }
}

export default new AccountsRepository();
