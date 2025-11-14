-- Digital Banking Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Accounts table
CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    account_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(15, 2) DEFAULT 0.00 NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR' NOT NULL,
    account_type VARCHAR(50) DEFAULT 'checking',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL, -- 'debit', 'credit', 'transfer'
    amount DECIMAL(15, 2) NOT NULL,
    balance_after DECIMAL(15, 2) NOT NULL,
    description TEXT,
    reference VARCHAR(100),
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- Seed data for development
INSERT INTO users (email, password, first_name, last_name) VALUES
    ('john.doe@example.com', 'hashed_password_1', 'John', 'Doe'),
    ('jane.smith@example.com', 'hashed_password_2', 'Jane', 'Smith')
ON CONFLICT (email) DO NOTHING;

INSERT INTO accounts (account_number, user_id, balance, currency, account_type) VALUES
    ('FR7612345678901234567890123', 1, 5000.00, 'EUR', 'checking'),
    ('FR7698765432109876543210987', 1, 15000.00, 'EUR', 'savings'),
    ('FR7611223344556677889900112', 2, 3200.50, 'EUR', 'checking')
ON CONFLICT (account_number) DO NOTHING;

INSERT INTO transactions (account_id, transaction_type, amount, balance_after, description) VALUES
    (1, 'credit', 1000.00, 5000.00, 'Salary deposit'),
    (1, 'debit', 50.00, 4950.00, 'Grocery shopping'),
    (2, 'credit', 5000.00, 15000.00, 'Savings transfer')
ON CONFLICT DO NOTHING;
