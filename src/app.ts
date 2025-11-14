import express, { Request, Response } from 'express';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';

import config from './config/env';
import authRoutes from './modules/auth/auth.routes';
import accountsRoutes from './modules/accounts/accounts.routes';
import transactionsRoutes from './modules/transactions/transactions.routes';
import bankRoutes from './modules/bank/bank.routes';
import errorHandler from './core/middleware/error-handler';

const app = express();

const corsOptions: CorsOptions = {
  origin: config.allowedOrigins
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: config.serviceName, timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/bank', bankRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Ressource non trouvée' });
});

app.use(errorHandler);

export default app;
