import { NextFunction, Request, Response } from 'express';
import authService from '../../modules/auth/auth.service';

const apiKeyMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const apiKey = req.header('x-api-key');
  authService.validateApiKey(apiKey);
  next();
};

export default apiKeyMiddleware;
