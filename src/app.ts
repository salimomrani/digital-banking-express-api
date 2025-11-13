import express, { NextFunction, Request, Response } from 'express';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';

import routes from './routes';
import config from './config/env';

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

app.use('/api', routes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Ressource non trouvée' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    message: 'Erreur interne du serveur',
    details: config.env === 'development' ? err.message : undefined
  });
});

export default app;
