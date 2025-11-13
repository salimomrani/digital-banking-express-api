import http from 'http';
import app from './app';
import config from './config/env';
import connectDb from './config/db';
import logger from './core/utils/logger';

const server = http.createServer(app);

const start = async (): Promise<void> => {
  try {
    await connectDb();
    server.listen(config.port, () => {
      logger.info(`[server] ${config.serviceName} démarré sur le port ${config.port} (${config.env})`);
    });
  } catch (error) {
    logger.error('[server] démarrage impossible', error);
    process.exit(1);
  }
};

void start();

export default server;
