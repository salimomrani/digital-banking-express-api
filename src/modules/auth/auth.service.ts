import { LoginInput } from './auth.schemas';
import authRepository from './auth.repository';
import HttpException from '../../core/errors/http-exception';
import config from '../../config/env';
import { User } from '../../models/user.model';

class AuthService {
  login(payload: LoginInput): { token: string; apiKey: string; user: User } {
    const record = authRepository.findByEmail(payload.email);

    if (!record || record.password !== payload.password) {
      throw new HttpException(401, 'Identifiants invalides');
    }

    const token = Buffer.from(`${payload.email}:${Date.now()}`).toString('base64');
    const { password: _password, ...user } = record;
    void _password;

    return { token, apiKey: config.apiKey, user };
  }

  validateApiKey(apiKey?: string): void {
    if (!apiKey || apiKey !== config.apiKey) {
      throw new HttpException(401, 'Clé API invalide');
    }
  }

  me(): User {
    return authRepository.getDefaultUser();
  }
}

export default new AuthService();
