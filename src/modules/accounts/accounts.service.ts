import accountsRepository from './accounts.repository';
import HttpException from '../../core/errors/http-exception';
import { Account } from '../../models/account.model';

class AccountsService {
  listAccounts(): Account[] {
    return accountsRepository.findAll();
  }

  getAccount(accountId: string): Account {
    const account = accountsRepository.findById(accountId);
    if (!account) {
      throw new HttpException(404, 'Compte introuvable');
    }
    return account;
  }
}

export default new AccountsService();
