import { Router } from 'express';
import * as bankController from './bank.controller';

const router = Router();

// Data generation endpoints
router.post('/generate-accounts', bankController.generateAccounts);
router.post('/generate-transactions', bankController.generateTransactions);

// Banking operations
router.post('/transfers', bankController.createTransfer);
router.post('/cards', bankController.createCard);
router.post('/loans', bankController.createLoan);

// Query endpoints
router.get('/cards/:accountId', bankController.getCardsByAccount);
router.get('/loans/:accountId', bankController.getLoansByAccount);

// Utility endpoints
router.delete('/reset', bankController.resetAllData);

export default router;
