import obpClient from './obp.client';
import logger from '../../core/utils/logger';
import { OBPTransaction, OBPTransactionRequest } from './obp.types';

/**
 * Service for OBP Transaction operations
 */
class OBPTransactionsService {
  /**
   * Create a transaction (payment)
   * Note: This requires proper permissions and setup in OBP
   */
  async createTransaction(
    bankId: string,
    accountId: string,
    viewId: string,
    transactionRequest: OBPTransactionRequest,
    token: string
  ): Promise<unknown> {
    try {
      logger.info('[OBP Transactions Service] Creating transaction:', {
        bankId,
        accountId,
        amount: transactionRequest.value.amount
      });

      const response = await obpClient.post(
        `/obp/v5.1.0/banks/${bankId}/accounts/${accountId}/${viewId}/transaction-request-types/SANDBOX_TAN/transaction-requests`,
        transactionRequest,
        token
      );

      logger.info('[OBP Transactions Service] Transaction created successfully');
      return response;
    } catch (error) {
      logger.error('[OBP Transactions Service] Failed to create transaction:', error);
      throw error;
    }
  }

  /**
   * Get transaction by ID
   */
  async getTransactionById(
    bankId: string,
    accountId: string,
    viewId: string,
    transactionId: string,
    token: string
  ): Promise<OBPTransaction> {
    try {
      logger.info('[OBP Transactions Service] Fetching transaction:', {
        bankId,
        accountId,
        transactionId
      });

      const transaction = await obpClient.get<OBPTransaction>(
        `/obp/v5.1.0/banks/${bankId}/accounts/${accountId}/${viewId}/transactions/${transactionId}/transaction`,
        token
      );

      logger.info('[OBP Transactions Service] Transaction fetched successfully');
      return transaction;
    } catch (error) {
      logger.error('[OBP Transactions Service] Failed to fetch transaction:', error);
      throw error;
    }
  }

  /**
   * Get transactions with filters
   * @param filters Optional filters (dates, limit, offset)
   */
  async getTransactions(
    bankId: string,
    accountId: string,
    viewId: string,
    token: string,
    filters?: {
      from_date?: string; // Format: 2023-01-01T00:00:00.000Z
      to_date?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ transactions: OBPTransaction[] }> {
    try {
      logger.info('[OBP Transactions Service] Fetching transactions with filters:', filters);

      const queryParams = new URLSearchParams();
      if (filters?.from_date) queryParams.append('from_date', filters.from_date);
      if (filters?.to_date) queryParams.append('to_date', filters.to_date);
      if (filters?.limit) queryParams.append('limit', filters.limit.toString());
      if (filters?.offset) queryParams.append('offset', filters.offset.toString());

      const endpoint = `/obp/v5.1.0/banks/${bankId}/accounts/${accountId}/${viewId}/transactions${
        queryParams.toString() ? '?' + queryParams.toString() : ''
      }`;

      const response = await obpClient.get<{ transactions: OBPTransaction[] }>(
        endpoint,
        token
      );

      logger.info(
        `[OBP Transactions Service] Fetched ${response.transactions.length} transactions`
      );
      return response;
    } catch (error) {
      logger.error('[OBP Transactions Service] Failed to fetch transactions:', error);
      throw error;
    }
  }
}

export default new OBPTransactionsService();
