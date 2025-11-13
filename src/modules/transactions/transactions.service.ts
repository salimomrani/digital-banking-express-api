import accountsRepository from '../accounts/accounts.repository';
import transactionsRepository from './transactions.repository';
import HttpException from '../../core/errors/http-exception';
import { Transaction } from '../../models/transaction.model';
import { TransactionPayload } from './transactions.schemas';

class TransactionsService {
  listTransactions(accountId: string): Transaction[] {
    const account = accountsRepository.findById(accountId);
    if (!account) {
      throw new HttpException(404, 'Compte introuvable');
    }
    return account.transactions;
  }

  createTransaction(accountId: string, payload: TransactionPayload) {
    const account = accountsRepository.findById(accountId);
    if (!account) {
      throw new HttpException(404, 'Compte introuvable');
    }

    if (payload.type === 'debit' && payload.amount > account.balance) {
      throw new HttpException(400, 'Solde insuffisant');
    }

    const transaction: Transaction = {
      id: `TRX-${Date.now()}`,
      type: payload.type,
      amount: payload.amount,
      label: payload.label || 'Transaction',
      date: new Date().toISOString().slice(0, 10)
    };

    if (payload.type === 'credit') {
      account.balance += payload.amount;
    } else {
      account.balance -= payload.amount;
    }

    account.transactions.unshift(transaction);
    transactionsRepository.persist(account);

    return { account, transaction };
  }
}

export default new TransactionsService();
