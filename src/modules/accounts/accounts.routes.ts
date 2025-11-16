import { Router } from 'express';
import { createAccountTransaction, getAccountById, listAccounts } from './accounts.controller';

const router = Router();

router.get('/', listAccounts);
router.get('/:accountId', getAccountById);
router.post('/:accountId/transactions', createAccountTransaction);

export default router;
