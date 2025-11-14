import { pool } from '../../config/db';
import { Transaction } from '../../models/transaction.model';

class TransactionsRepository {
  async listByAccountId(accountId: string): Promise<Transaction[]> {
    const query = `
      SELECT
        t.id,
        t.transaction_type as type,
        t.amount,
        t.description as label,
        to_char(t.created_at, 'YYYY-MM-DD') as date
      FROM transactions t
      INNER JOIN accounts a ON t.account_id = a.id
      WHERE a.account_number = $1
      ORDER BY t.created_at DESC
    `;

    const result = await pool.query(query, [accountId]);

    return result.rows.map((row) => ({
      id: row.id.toString(),
      type: row.type,
      amount: parseFloat(row.amount),
      label: row.label,
      date: row.date
    }));
  }
}

export default new TransactionsRepository();
