import accountsRepository from './accounts.repository';
import HttpException from '../../core/errors/http-exception';
import { Account } from '../../models/account.model';

class AccountsService {
  async listAccounts(): Promise<Account[]> {
    return await accountsRepository.findAll();
  }

  async getAccount(accountId: string): Promise<Account> {
    const account = await accountsRepository.findById(accountId);
    if (!account) {
      throw new HttpException(404, 'Compte introuvable');
    }
    return account;
  }
}

export default new AccountsService();
