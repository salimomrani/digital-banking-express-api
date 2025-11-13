import { Router } from 'express';
import apiKeyMiddleware from '../../core/middleware/api-key.middleware';
import { createAccountTransaction, getAccountById, listAccounts } from './accounts.controller';

const router = Router();

router.use(apiKeyMiddleware);
router.get('/', listAccounts);
router.get('/:accountId', getAccountById);
router.post('/:accountId/transactions', createAccountTransaction);

export default router;
