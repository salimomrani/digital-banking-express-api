/**
 * Open Bank Project (OBP) Integration Module
 *
 * This module provides integration with Open Bank Project API v5.1.0
 * Documentation: https://apiexplorer-ii-sandbox.openbankproject.com
 *
 * Features:
 * - Direct Login authentication
 * - Account management
 * - Transaction operations
 * - Balance inquiries
 *
 * Usage:
 * ```typescript
 * import { obpClient, obpAccountsService, obpTransactionsService } from './modules/obp';
 *
 * // Authenticate
 * const token = await obpClient.directLogin({
 *   username: 'your-username',
 *   password: 'your-password',
 *   consumerKey: process.env.OBP_CONSUMER_KEY
 * });
 *
 * // Get accounts
 * const accounts = await obpAccountsService.getAccounts(token);
 * ```
 */

export { default as obpClient } from './obp.client';
export { default as obpAccountsService } from './obp-accounts.service';
export { default as obpTransactionsService } from './obp-transactions.service';
export * from './obp.types';
