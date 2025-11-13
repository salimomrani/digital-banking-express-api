const { Router } = require('express');
const accountController = require('../controllers/account.controller');

const router = Router();

router.get('/', accountController.listAccounts);
router.get('/:accountId', accountController.getAccountById);
router.post('/:accountId/transactions', accountController.createTransaction);

module.exports = router;
