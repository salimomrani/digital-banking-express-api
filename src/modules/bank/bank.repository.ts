import { Prisma } from '@prisma/client';
import { prisma } from '../../config/db';

export class BankRepository {
  constructor() {
  }

  async createAccount(data: Prisma.AccountCreateInput) {
    return await prisma.account.create({ data });
  }

  async createTransaction(data: Prisma.TransactionCreateInput) {
    return await prisma.transaction.create({ data });
  }

  async createCard(data: Prisma.CardCreateInput) {
    return await prisma.card.create({ data });
  }

  async createLoan(data: Prisma.LoanCreateInput) {
    return await prisma.loan.create({ data });
  }

  async getAccountById(id: number) {
    return await prisma.account.findUnique({
      where: { id },
      include: {
        user: true,
        cards: true,
        loans: true
      }
    });
  }

  async updateAccountBalance(id: number, balance: number) {
    return await prisma.account.update({
      where: { id },
      data: { balance }
    });
  }

  async getCardsByAccountId(accountId: number) {
    return await prisma.card.findMany({
      where: { accountId }
    });
  }

  async getLoansByAccountId(accountId: number) {
    return await prisma.loan.findMany({
      where: { accountId }
    });
  }

  async createUser(data: Prisma.UserCreateInput) {
    return await prisma.user.create({ data });
  }

  async getAllUsers() {
    return await prisma.user.findMany();
  }

  async performTransfer(
    fromAccountId: number,
    toAccountId: number,
    amount: number,
    description?: string
  ) {
    return await prisma.$transaction(async (tx) => {
      // Get source account
      const fromAccount = await tx.account.findUnique({
        where: { id: fromAccountId }
      });

      if (!fromAccount) {
        throw new Error('Source account not found');
      }

      if (parseFloat(fromAccount.balance.toString()) < amount) {
        throw new Error('Insufficient balance');
      }

      // Get destination account
      const toAccount = await tx.account.findUnique({
        where: { id: toAccountId }
      });

      if (!toAccount) {
        throw new Error('Destination account not found');
      }

      // Update source account
      const newFromBalance = parseFloat(fromAccount.balance.toString()) - amount;
      await tx.account.update({
        where: { id: fromAccountId },
        data: { balance: newFromBalance }
      });

      // Create debit transaction
      await tx.transaction.create({
        data: {
          accountId: fromAccountId,
          transactionType: 'debit',
          amount,
          balanceAfter: newFromBalance,
          description: description || 'Transfer out',
          reference: `TRF-${Date.now()}`,
          status: 'completed'
        }
      });

      // Update destination account
      const newToBalance = parseFloat(toAccount.balance.toString()) + amount;
      await tx.account.update({
        where: { id: toAccountId },
        data: { balance: newToBalance }
      });

      // Create credit transaction
      await tx.transaction.create({
        data: {
          accountId: toAccountId,
          transactionType: 'credit',
          amount,
          balanceAfter: newToBalance,
          description: description || 'Transfer in',
          reference: `TRF-${Date.now()}`,
          status: 'completed'
        }
      });

      return { success: true };
    });
  }

  async deleteAllMockData() {
    await prisma.$transaction([
      prisma.transaction.deleteMany(),
      prisma.card.deleteMany(),
      prisma.loan.deleteMany(),
      prisma.account.deleteMany(),
      prisma.user.deleteMany()
    ]);
  }
}

export default new BankRepository();
