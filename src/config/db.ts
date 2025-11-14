import { PrismaClient } from '@prisma/client';
import logger from '../core/utils/logger';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

const connectDb = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('[db] Connected to PostgreSQL database via Prisma');
  } catch (error) {
    logger.error('[db] Failed to connect to database', error);
    throw error;
  }
};

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default connectDb;
