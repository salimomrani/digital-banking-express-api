import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import HttpException from '../errors/http-exception';
import logger from '../utils/logger';

const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): Response => {
  if (err instanceof HttpException) {
    return res.status(err.statusCode).json({ message: err.message, details: err.details });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({ message: 'Payload invalide', details: err.flatten() });
  }

  logger.error(err);
  return res.status(500).json({
    message: 'Erreur interne du serveur'
  });
};

export default errorHandler;
