import { Router } from 'express';
import { login, profile } from './auth.controller';
import apiKeyMiddleware from '../../core/middleware/api-key.middleware';

const router = Router();

router.post('/login', login);
router.get('/me', apiKeyMiddleware, profile);

export default router;
