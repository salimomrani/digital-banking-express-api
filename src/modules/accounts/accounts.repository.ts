import { pool } from '../../config/db';
import { Account } from '../../models/account.model';
import { Transaction } from '../../models/transaction.model';

class AccountsRepository {
  async findAll(): Promise<Account[]> {
    const query = `
      SELECT
        a.id,
        a.account_number,
        u.first_name || ' ' || u.last_name as owner,
        a.balance,
        a.currency,
        COALESCE(
          json_agg(
            json_build_object(
              'id', t.id::text,
              'type', t.transaction_type,
              'amount', t.amount,
              'label', t.description,
              'date', to_char(t.created_at, 'YYYY-MM-DD')
            ) ORDER BY t.created_at DESC
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) as transactions
      FROM accounts a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN transactions t ON t.account_id = a.id
      GROUP BY a.id, u.first_name, u.last_name
      ORDER BY a.id
    `;

    const result = await pool.query(query);
    return result.rows.map((row) => ({
      id: row.account_number,
      owner: row.owner,
      balance: parseFloat(row.balance),
      currency: row.currency,
      transactions: row.transactions
    }));
  }

  async findById(accountId: string): Promise<Account | undefined> {
    const query = `
      SELECT
        a.id,
        a.account_number,
        u.first_name || ' ' || u.last_name as owner,
        a.balance,
        a.currency,
        COALESCE(
          json_agg(
            json_build_object(
              'id', t.id::text,
              'type', t.transaction_type,
              'amount', t.amount,
              'label', t.description,
              'date', to_char(t.created_at, 'YYYY-MM-DD')
            ) ORDER BY t.created_at DESC
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) as transactions
      FROM accounts a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN transactions t ON t.account_id = a.id
      WHERE a.account_number = $1
      GROUP BY a.id, u.first_name, u.last_name
    `;

    const result = await pool.query(query, [accountId]);

    if (result.rows.length === 0) {
      return undefined;
    }

    const row = result.rows[0];
    return {
      id: row.account_number,
      owner: row.owner,
      balance: parseFloat(row.balance),
      currency: row.currency,
      transactions: row.transactions
    };
  }

  async save(account: Account): Promise<Account> {
    // Update account balance
    const updateQuery = `
      UPDATE accounts
      SET balance = $1, updated_at = CURRENT_TIMESTAMP
      WHERE account_number = $2
      RETURNING *
    `;

    await pool.query(updateQuery, [account.balance, account.id]);
    return account;
  }

  async addTransaction(accountId: string, transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Get account internal ID and current balance
      const accountQuery = 'SELECT id, balance FROM accounts WHERE account_number = $1';
      const accountResult = await client.query(accountQuery, [accountId]);

      if (accountResult.rows.length === 0) {
        throw new Error('Account not found');
      }

      const accountDbId = accountResult.rows[0].id;
      const currentBalance = parseFloat(accountResult.rows[0].balance);

      // Calculate new balance
      const newBalance = transaction.type === 'credit'
        ? currentBalance + transaction.amount
        : currentBalance - transaction.amount;

      // Insert transaction
      const transactionQuery = `
        INSERT INTO transactions (account_id, transaction_type, amount, balance_after, description)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, transaction_type as type, amount, description as label, to_char(created_at, 'YYYY-MM-DD') as date
      `;

      const transactionResult = await client.query(transactionQuery, [
        accountDbId,
        transaction.type,
        transaction.amount,
        newBalance,
        transaction.label
      ]);

      // Update account balance
      const updateBalanceQuery = 'UPDATE accounts SET balance = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
      await client.query(updateBalanceQuery, [newBalance, accountDbId]);

      await client.query('COMMIT');

      const row = transactionResult.rows[0];
      return {
        id: row.id.toString(),
        type: row.type,
        amount: parseFloat(row.amount),
        label: row.label,
        date: row.date
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

export default new AccountsRepository();
