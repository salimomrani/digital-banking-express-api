import { Router } from 'express';
import apiKeyMiddleware from '../../core/middleware/api-key.middleware';
import { createTransaction, listTransactions } from './transactions.controller';

const router = Router();

router.use(apiKeyMiddleware);
router.get('/:accountId', listTransactions);
router.post('/:accountId', createTransaction);

export default router;
