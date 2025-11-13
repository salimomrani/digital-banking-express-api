const { Router } = require('express');
const accountRoutes = require('./account.routes');

const router = Router();

router.use('/accounts', accountRoutes);

module.exports = router;
