import { Request, Response } from 'express';
import authService from './auth.service';
import { loginSchema } from './auth.schemas';
import HttpException from '../../core/errors/http-exception';

export const login = (req: Request, res: Response): Response => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    throw new HttpException(400, 'Payload invalide', result.error.flatten());
  }

  const payload = authService.login(result.data);
  return res.json(payload);
};

export const profile = (_req: Request, res: Response): Response => {
  return res.json({ user: authService.me() });
};
