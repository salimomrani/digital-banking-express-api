const accounts = [
  {
    id: 'ACC-1001',
    owner: 'Awa Traoré',
    balance: 12500.45,
    currency: 'EUR',
    transactions: [
      { id: 'TRX-9001', type: 'credit', amount: 2500, label: 'Salaire', date: '2024-11-01' },
      { id: 'TRX-9002', type: 'debit', amount: 150, label: 'Courses', date: '2024-11-03' }
    ]
  },
  {
    id: 'ACC-2001',
    owner: 'Rayan Dupuis',
    balance: 8200.1,
    currency: 'EUR',
    transactions: [
      { id: 'TRX-9101', type: 'credit', amount: 1200, label: 'Facturation freelance', date: '2024-10-30' },
      { id: 'TRX-9102', type: 'debit', amount: 90, label: 'Abonnement mobile', date: '2024-11-02' }
    ]
  }
];

module.exports = accounts;
