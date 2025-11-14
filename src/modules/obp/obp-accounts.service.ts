import obpClient from './obp.client';
import logger from '../../core/utils/logger';
import HttpException from '../../core/errors/http-exception';
import {
  OBPAccount,
  OBPAccountsResponse,
  OBPTransactionsResponse
} from './obp.types';

/**
 * Service for OBP Account operations
 */
class OBPAccountsService {
  /**
   * Get all accounts for the authenticated user
   */
  async getAccounts(token: string): Promise<OBPAccount[]> {
    try {
      logger.info('[OBP Accounts Service] Fetching accounts...');

      const response = await obpClient.get<OBPAccountsResponse>(
        '/obp/v5.1.0/my/accounts',
        token
      );

      logger.info(`[OBP Accounts Service] Fetched ${response.accounts.length} accounts`);
      return response.accounts;
    } catch (error) {
      logger.error('[OBP Accounts Service] Failed to fetch accounts:', error);
      throw error;
    }
  }

  /**
   * Get account by ID
   */
  async getAccountById(
    bankId: string,
    accountId: string,
    token: string
  ): Promise<OBPAccount> {
    try {
      logger.info('[OBP Accounts Service] Fetching account:', { bankId, accountId });

      const account = await obpClient.get<OBPAccount>(
        `/obp/v5.1.0/banks/${bankId}/accounts/${accountId}/account`,
        token
      );

      logger.info('[OBP Accounts Service] Account fetched successfully');
      return account;
    } catch (error) {
      logger.error('[OBP Accounts Service] Failed to fetch account:', error);
      throw error;
    }
  }

  /**
   * Get account transactions
   */
  async getAccountTransactions(
    bankId: string,
    accountId: string,
    viewId: string,
    token: string
  ): Promise<OBPTransactionsResponse> {
    try {
      logger.info('[OBP Accounts Service] Fetching transactions:', {
        bankId,
        accountId,
        viewId
      });

      const response = await obpClient.get<OBPTransactionsResponse>(
        `/obp/v5.1.0/banks/${bankId}/accounts/${accountId}/${viewId}/transactions`,
        token
      );

      logger.info(
        `[OBP Accounts Service] Fetched ${response.transactions.length} transactions`
      );
      return response;
    } catch (error) {
      logger.error('[OBP Accounts Service] Failed to fetch transactions:', error);
      throw error;
    }
  }

  /**
   * Get account balance
   */
  async getAccountBalance(
    bankId: string,
    accountId: string,
    token: string
  ): Promise<{ currency: string; amount: string }> {
    try {
      const account = await this.getAccountById(bankId, accountId, token);
      return account.balance;
    } catch (error) {
      logger.error('[OBP Accounts Service] Failed to get balance:', error);
      throw error;
    }
  }

  /**
   * Search accounts by IBAN
   */
  async searchAccountsByIBAN(
    iban: string,
    token: string
  ): Promise<OBPAccount | null> {
    try {
      const accounts = await this.getAccounts(token);
      const account = accounts.find((acc) => acc.IBAN === iban);
      return account || null;
    } catch (error) {
      logger.error('[OBP Accounts Service] Failed to search by IBAN:', error);
      throw error;
    }
  }
}

export default new OBPAccountsService();
