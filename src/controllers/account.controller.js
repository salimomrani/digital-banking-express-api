const accounts = require('../data/accounts');

const findAccount = (accountId) => accounts.find((account) => account.id === accountId);

const listAccounts = (req, res) => {
  return res.json({ accounts });
};

const getAccountById = (req, res) => {
  const account = findAccount(req.params.accountId);

  if (!account) {
    return res.status(404).json({ message: 'Compte introuvable' });
  }

  return res.json({ account });
};

const createTransaction = (req, res) => {
  const account = findAccount(req.params.accountId);

  if (!account) {
    return res.status(404).json({ message: 'Compte introuvable' });
  }

  const { type, amount, label } = req.body || {};

  if (!['credit', 'debit'].includes(type)) {
    return res.status(400).json({ message: "Le type doit être 'credit' ou 'debit'" });
  }

  if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Le montant doit être un nombre positif' });
  }

  const transaction = {
    id: `TRX-${Date.now()}`,
    type,
    amount,
    label: label || 'Transaction',
    date: new Date().toISOString().slice(0, 10)
  };

  if (type === 'credit') {
    account.balance += amount;
  } else {
    if (amount > account.balance) {
      return res.status(400).json({ message: 'Solde insuffisant' });
    }
    account.balance -= amount;
  }

  account.transactions.unshift(transaction);

  return res.status(201).json({
    message: 'Transaction enregistrée',
    account: {
      id: account.id,
      balance: account.balance,
      currency: account.currency
    },
    transaction
  });
};

module.exports = {
  listAccounts,
  getAccountById,
  createTransaction
};
