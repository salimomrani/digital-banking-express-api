import { Pool } from 'pg';
import logger from '../core/utils/logger';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'banking_user',
  password: process.env.DB_PASSWORD || 'banking_password',
  database: process.env.DB_NAME || 'digital_banking',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
};

export const pool = new Pool(dbConfig);

pool.on('error', (err) => {
  logger.error('[db] Unexpected error on idle client', err);
});

const connectDb = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    logger.info(`[db] Connected to PostgreSQL database: ${dbConfig.database}`);
    client.release();
  } catch (error) {
    logger.error('[db] Failed to connect to database', error);
    throw error;
  }
};

export default connectDb;
