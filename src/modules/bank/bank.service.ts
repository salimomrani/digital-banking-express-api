import bankRepository from './bank.repository';
import {
  GenerateAccountsInput,
  GenerateTransactionsInput,
  TransferInput,
  CreateCardInput,
  CreateLoanInput
} from './bank.schemas';

class BankService {
  private generateRandomString(length: number): string {
    const chars = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private generateAccountNumber(): string {
    return `FR76${this.generateRandomString(20)}`;
  }

  private generateCardNumber(): string {
    // Generate a Luhn-valid card number
    const prefix = '4532'; // Visa prefix
    const middle = this.generateRandomString(8);
    return prefix + middle + this.generateRandomString(4);
  }

  private generateExpiryDate(): string {
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const year = String(new Date().getFullYear() + Math.floor(Math.random() * 5) + 1).slice(-2);
    return `${month}/${year}`;
  }

  private generateCVV(): string {
    return this.generateRandomString(3);
  }

  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  async generateAccounts(input: GenerateAccountsInput) {
    const { count, userId } = input;
    const accounts = [];

    // If no userId provided, create a mock user
    let targetUserId = userId;
    if (!targetUserId) {
      const users = await bankRepository.getAllUsers();
      if (users.length > 0) {
        targetUserId = users[0].id;
      } else {
        const mockUser = await bankRepository.createUser({
          email: `mock.user.${Date.now()}@example.com`,
          password: 'mockpassword123',
          firstName: 'Mock',
          lastName: 'User'
        });
        targetUserId = mockUser.id;
      }
    }

    const accountTypes = ['checking', 'savings', 'business'];
    const currencies = ['EUR', 'USD', 'GBP'];

    for (let i = 0; i < count; i++) {
      const account = await bankRepository.createAccount({
        accountNumber: this.generateAccountNumber(),
        balance: Math.floor(Math.random() * 50000) + 1000,
        currency: this.getRandomElement(currencies),
        accountType: this.getRandomElement(accountTypes),
        status: 'active',
        user: {
          connect: { id: targetUserId }
        }
      });
      accounts.push(account);
    }

    return accounts;
  }

  async generateTransactions(input: GenerateTransactionsInput) {
    const { count, accountId } = input;

    const account = await bankRepository.getAccountById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    const transactions = [];
    let currentBalance = parseFloat(account.balance.toString());

    const transactionTypes = ['credit', 'debit'];
    const descriptions = [
      'Online purchase',
      'ATM withdrawal',
      'Direct deposit',
      'Bill payment',
      'Transfer',
      'Refund',
      'Subscription payment',
      'Restaurant'
    ];

    for (let i = 0; i < count; i++) {
      const type = this.getRandomElement(transactionTypes);
      const amount = Math.floor(Math.random() * 500) + 10;

      if (type === 'debit') {
        currentBalance -= amount;
      } else {
        currentBalance += amount;
      }

      const transaction = await bankRepository.createTransaction({
        transactionType: type,
        amount,
        balanceAfter: currentBalance,
        description: this.getRandomElement(descriptions),
        reference: `REF-${this.generateRandomString(10)}`,
        status: 'completed',
        account: {
          connect: { id: accountId }
        }
      });

      transactions.push(transaction);
    }

    // Update account balance
    await bankRepository.updateAccountBalance(accountId, currentBalance);

    return transactions;
  }

  async createTransfer(input: TransferInput) {
    const { fromAccountId, toAccountId, amount, description, transferType } = input;

    if (fromAccountId === toAccountId) {
      throw new Error('Cannot transfer to the same account');
    }

    const result = await bankRepository.performTransfer(
      fromAccountId,
      toAccountId,
      amount,
      description
    );

    return {
      ...result,
      transferType,
      amount,
      fromAccountId,
      toAccountId,
      timestamp: new Date().toISOString()
    };
  }

  async createCard(input: CreateCardInput) {
    const { accountId, cardType, limit } = input;

    const account = await bankRepository.getAccountById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    const cardholderName = `${account.user.firstName} ${account.user.lastName}`.toUpperCase();

    const card = await bankRepository.createCard({
      cardNumber: this.generateCardNumber(),
      cardType,
      cardholderName,
      expiryDate: this.generateExpiryDate(),
      cvv: this.generateCVV(),
      status: 'active',
      limit: limit || (cardType === 'credit' ? 5000 : null),
      account: {
        connect: { id: accountId }
      }
    });

    return card;
  }

  async createLoan(input: CreateLoanInput) {
    const { accountId, loanType, amount, interestRate, durationMonths } = input;

    const account = await bankRepository.getAccountById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    // Calculate monthly payment using simple amortization formula
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) /
      (Math.pow(1 + monthlyRate, durationMonths) - 1);

    const loan = await bankRepository.createLoan({
      loanType,
      amount,
      remainingBalance: amount,
      interestRate,
      durationMonths,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      status: 'active',
      account: {
        connect: { id: accountId }
      }
    });

    return loan;
  }

  async getCardsByAccount(accountId: number) {
    return await bankRepository.getCardsByAccountId(accountId);
  }

  async getLoansByAccount(accountId: number) {
    return await bankRepository.getLoansByAccountId(accountId);
  }

  async resetAllData() {
    await bankRepository.deleteAllMockData();
    return { message: 'All data deleted successfully' };
  }
}

export default new BankService();
