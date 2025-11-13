import accountsRepository from '../accounts/accounts.repository';
import { Account } from '../../models/account.model';
import { Transaction } from '../../models/transaction.model';

class TransactionsRepository {
  listByAccountId(accountId: string): Transaction[] {
    const account = accountsRepository.findById(accountId);
    return account ? account.transactions : [];
  }

  persist(account: Account): Account {
    return accountsRepository.save(account);
  }
}

export default new TransactionsRepository();
