import { Router } from 'express';
import { listAccounts, getAccountById, createTransaction } from '../controllers/account.controller';

const router = Router();

router.get('/', listAccounts);
router.get('/:accountId', getAccountById);
router.post('/:accountId/transactions', createTransaction);

export default router;
