import { pool } from '../../config/db';
import { User } from '../../models/user.model';

class AuthRepository {
  async findByEmail(email: string): Promise<(User & { password: string }) | undefined> {
    const query = `
      SELECT
        id,
        email,
        password,
        first_name || ' ' || last_name as name,
        ARRAY['customer']::text[] as roles
      FROM users
      WHERE email = $1
    `;

    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return undefined;
    }

    const row = result.rows[0];
    return {
      id: row.id.toString(),
      email: row.email,
      name: row.name,
      roles: row.roles,
      password: row.password
    };
  }

  async getDefaultUser(): Promise<User> {
    const query = `
      SELECT
        id,
        email,
        first_name || ' ' || last_name as name,
        ARRAY['customer']::text[] as roles
      FROM users
      LIMIT 1
    `;

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      throw new Error('No users found in database');
    }

    const row = result.rows[0];
    return {
      id: row.id.toString(),
      email: row.email,
      name: row.name,
      roles: row.roles
    };
  }
}

export default new AuthRepository();
