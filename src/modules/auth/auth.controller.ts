import { Request, Response } from 'express';
import authService from './auth.service';
import { loginSchema } from './auth.schemas';
import HttpException from '../../core/errors/http-exception';

export const login = async (req: Request, res: Response): Promise<Response> => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    throw new HttpException(400, 'Payload invalide', result.error.flatten());
  }

  const payload = await authService.login(result.data);
  return res.json(payload);
};

export const profile = async (_req: Request, res: Response): Promise<Response> => {
  const user = await authService.me();
  return res.json({ user });
};
