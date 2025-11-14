import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create users
  const user1 = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      email: 'john.doe@example.com',
      password: 'hashed_password_1',
      firstName: 'John',
      lastName: 'Doe'
    }
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      email: 'jane.smith@example.com',
      password: 'hashed_password_2',
      firstName: 'Jane',
      lastName: 'Smith'
    }
  });

  console.log({ user1, user2 });

  // Create accounts
  const account1 = await prisma.account.upsert({
    where: { accountNumber: 'FR7612345678901234567890123' },
    update: {},
    create: {
      accountNumber: 'FR7612345678901234567890123',
      userId: user1.id,
      balance: 5000.00,
      currency: 'EUR',
      accountType: 'checking'
    }
  });

  const account2 = await prisma.account.upsert({
    where: { accountNumber: 'FR7698765432109876543210987' },
    update: {},
    create: {
      accountNumber: 'FR7698765432109876543210987',
      userId: user1.id,
      balance: 15000.00,
      currency: 'EUR',
      accountType: 'savings'
    }
  });

  const account3 = await prisma.account.upsert({
    where: { accountNumber: 'FR7611223344556677889900112' },
    update: {},
    create: {
      accountNumber: 'FR7611223344556677889900112',
      userId: user2.id,
      balance: 3200.50,
      currency: 'EUR',
      accountType: 'checking'
    }
  });

  console.log({ account1, account2, account3 });

  // Create transactions
  await prisma.transaction.createMany({
    data: [
      {
        accountId: account1.id,
        transactionType: 'credit',
        amount: 1000.00,
        balanceAfter: 5000.00,
        description: 'Salary deposit'
      },
      {
        accountId: account1.id,
        transactionType: 'debit',
        amount: 50.00,
        balanceAfter: 4950.00,
        description: 'Grocery shopping'
      },
      {
        accountId: account2.id,
        transactionType: 'credit',
        amount: 5000.00,
        balanceAfter: 15000.00,
        description: 'Savings transfer'
      }
    ],
    skipDuplicates: true
  });

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
