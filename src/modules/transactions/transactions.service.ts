import accountsRepository from '../accounts/accounts.repository';
import transactionsRepository from './transactions.repository';
import HttpException from '../../core/errors/http-exception';
import { Transaction } from '../../models/transaction.model';
import { TransactionPayload } from './transactions.schemas';

class TransactionsService {
  async listTransactions(accountId: string): Promise<Transaction[]> {
    const account = await accountsRepository.findById(accountId);
    if (!account) {
      throw new HttpException(404, 'Compte introuvable');
    }
    return account.transactions;
  }

  async createTransaction(accountId: string, payload: TransactionPayload) {
    const account = await accountsRepository.findById(accountId);
    if (!account) {
      throw new HttpException(404, 'Compte introuvable');
    }

    if (payload.type === 'debit' && payload.amount > account.balance) {
      throw new HttpException(400, 'Solde insuffisant');
    }

    const transactionData: Omit<Transaction, 'id'> = {
      type: payload.type,
      amount: payload.amount,
      label: payload.label || 'Transaction',
      date: new Date().toISOString().slice(0, 10)
    };

    // Use the new addTransaction method that handles DB transaction
    const transaction = await accountsRepository.addTransaction(accountId, transactionData);

    // Fetch updated account
    const updatedAccount = await accountsRepository.findById(accountId);

    return { account: updatedAccount!, transaction };
  }
}

export default new TransactionsService();
