-- ============================================================================
-- HORIZON BANKING MANAGEMENT SYSTEM - DATABASE SCHEMA
-- MySQL Workbench Compatible Version (No DELIMITER commands)
-- ============================================================================
-- Created: October 2025
-- Description: Complete database schema for Horizon Banking Management System
--              Designed for MySQL Workbench and other GUI SQL clients
-- ============================================================================

-- Drop existing database and create fresh
DROP DATABASE IF EXISTS horizon_banking;
CREATE DATABASE horizon_banking;
USE horizon_banking;

-- ============================================================================
-- TABLE 1: USERS
-- ============================================================================
CREATE TABLE Users (
    user_id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    ssn VARCHAR(11),
    address1 VARCHAR(255),
    city VARCHAR(100),
    state CHAR(2),
    postal_code VARCHAR(10),
    dwolla_customer_id VARCHAR(100) UNIQUE,
    dwolla_customer_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_state_length CHECK (LENGTH(state) = 2)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 2: BANKS
-- ============================================================================
CREATE TABLE Banks (
    bank_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    account_id VARCHAR(100) NOT NULL,
    access_token TEXT NOT NULL,
    plaid_bank_id VARCHAR(100),
    funding_source_url TEXT,
    shareable_id VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    CONSTRAINT fk_banks_user 
        FOREIGN KEY (user_id) REFERENCES Users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 3: TRANSACTIONS
-- ============================================================================
CREATE TABLE Transactions (
    transaction_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) DEFAULT 'Transfer',
    channel VARCHAR(20) DEFAULT 'online',
    sender_id VARCHAR(50) NOT NULL,
    sender_bank_id VARCHAR(50) NOT NULL,
    receiver_id VARCHAR(50) NOT NULL,
    receiver_bank_id VARCHAR(50) NOT NULL,
    receiver_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_amount_positive CHECK (amount > 0),
    CONSTRAINT chk_category CHECK (
        category IN ('Transfer', 'Food and Drink', 'Travel', 'Payment')
    ),
    CONSTRAINT chk_channel CHECK (
        channel IN ('online', 'in_store', 'other')
    ),
    
    -- Foreign Keys
    CONSTRAINT fk_transactions_sender 
        FOREIGN KEY (sender_id) REFERENCES Users(user_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_transactions_receiver 
        FOREIGN KEY (receiver_id) REFERENCES Users(user_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_transactions_sender_bank 
        FOREIGN KEY (sender_bank_id) REFERENCES Banks(bank_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_transactions_receiver_bank 
        FOREIGN KEY (receiver_bank_id) REFERENCES Banks(bank_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Users table indexes
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_users_dwolla ON Users(dwolla_customer_id);

-- Banks table indexes
CREATE INDEX idx_banks_user ON Banks(user_id);
CREATE INDEX idx_banks_account ON Banks(account_id);
CREATE INDEX idx_banks_shareable ON Banks(shareable_id);

-- Transactions table indexes
CREATE INDEX idx_trans_sender ON Transactions(sender_id);
CREATE INDEX idx_trans_receiver ON Transactions(receiver_id);
CREATE INDEX idx_trans_sender_bank ON Transactions(sender_bank_id);
CREATE INDEX idx_trans_receiver_bank ON Transactions(receiver_bank_id);
CREATE INDEX idx_trans_date ON Transactions(created_at);
CREATE INDEX idx_trans_category ON Transactions(category);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View: User transaction history with names
CREATE OR REPLACE VIEW user_transaction_history AS
SELECT 
    t.transaction_id,
    t.name AS transaction_name,
    t.amount,
    t.category,
    t.channel,
    CONCAT(sender.first_name, ' ', sender.last_name) AS sender_name,
    sender.email AS sender_email,
    CONCAT(receiver.first_name, ' ', receiver.last_name) AS receiver_name,
    receiver.email AS receiver_email,
    t.created_at AS transaction_date,
    CASE 
        WHEN DATEDIFF(CURRENT_DATE, DATE(t.created_at)) <= 2 THEN 'Processing'
        ELSE 'Success'
    END AS status
FROM Transactions t
JOIN Users sender ON t.sender_id = sender.user_id
JOIN Users receiver ON t.receiver_id = receiver.user_id;

-- View: User bank summary
CREATE OR REPLACE VIEW user_bank_summary AS
SELECT 
    u.user_id,
    CONCAT(u.first_name, ' ', u.last_name) AS full_name,
    u.email,
    COUNT(b.bank_id) AS total_banks,
    GROUP_CONCAT(b.bank_id SEPARATOR ', ') AS bank_ids
FROM Users u
LEFT JOIN Banks b ON u.user_id = b.user_id
GROUP BY u.user_id, u.first_name, u.last_name, u.email;

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Insert sample users
INSERT INTO Users (
    user_id, email, password_hash, first_name, last_name, 
    date_of_birth, ssn, address1, city, state, postal_code,
    dwolla_customer_id, dwolla_customer_url
) VALUES
(
    'user_001',
    'john.doe@example.com',
    '$2a$10$examplehash1234567890',
    'John',
    'Doe',
    '1990-05-15',
    '123-45-6789',
    '123 Main St',
    'New York',
    'NY',
    '10001',
    'dwolla_cust_001',
    'https://api-sandbox.dwolla.com/customers/dwolla_cust_001'
),
(
    'user_002',
    'jane.smith@example.com',
    '$2a$10$examplehash0987654321',
    'Jane',
    'Smith',
    '1988-08-20',
    '987-65-4321',
    '456 Oak Ave',
    'Los Angeles',
    'CA',
    '90001',
    'dwolla_cust_002',
    'https://api-sandbox.dwolla.com/customers/dwolla_cust_002'
);

-- Insert sample banks
INSERT INTO Banks (
    bank_id, user_id, account_id, access_token, 
    plaid_bank_id, funding_source_url, shareable_id
) VALUES
(
    'bank_001',
    'user_001',
    'plaid_acc_001',
    'access-sandbox-token-001',
    'ins_109508',
    'https://api-sandbox.dwolla.com/funding-sources/fund_001',
    'share_001'
),
(
    'bank_002',
    'user_002',
    'plaid_acc_002',
    'access-sandbox-token-002',
    'ins_109509',
    'https://api-sandbox.dwolla.com/funding-sources/fund_002',
    'share_002'
);

-- Insert sample transactions
INSERT INTO Transactions (
    transaction_id, name, amount, category, channel,
    sender_id, sender_bank_id, receiver_id, receiver_bank_id, receiver_email
) VALUES
(
    'txn_001',
    'Rent Payment',
    1500.00,
    'Transfer',
    'online',
    'user_001',
    'bank_001',
    'user_002',
    'bank_002',
    'jane.smith@example.com'
),
(
    'txn_002',
    'Lunch Reimbursement',
    25.50,
    'Food and Drink',
    'online',
    'user_002',
    'bank_002',
    'user_001',
    'bank_001',
    'john.doe@example.com'
),
(
    'txn_003',
    'Birthday Gift',
    100.00,
    'Transfer',
    'online',
    'user_001',
    'bank_001',
    'user_002',
    'bank_002',
    'jane.smith@example.com'
);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify data insertion
SELECT 'Users count:' AS info, COUNT(*) AS count FROM Users
UNION ALL
SELECT 'Banks count:', COUNT(*) FROM Banks
UNION ALL
SELECT 'Transactions count:', COUNT(*) FROM Transactions;

-- Display user transaction history
SELECT * FROM user_transaction_history ORDER BY transaction_date DESC;

-- Display user bank summary
SELECT * FROM user_bank_summary;

-- ============================================================================
-- USEFUL QUERIES FOR PRESENTATION
-- ============================================================================

-- Query 1: Get all transactions for a specific user (sent or received)
-- SELECT * FROM Transactions 
-- WHERE sender_id = 'user_001' OR receiver_id = 'user_001'
-- ORDER BY created_at DESC;

-- Query 2: Calculate total sent and received for a user
-- SELECT 
--     sender_id AS user_id,
--     SUM(amount) AS total_sent,
--     (SELECT SUM(amount) FROM Transactions WHERE receiver_id = 'user_001') AS total_received
-- FROM Transactions 
-- WHERE sender_id = 'user_001'
-- GROUP BY sender_id;

-- Query 3: Get bank account details with owner information
-- SELECT 
--     b.bank_id,
--     b.account_id,
--     b.shareable_id,
--     CONCAT(u.first_name, ' ', u.last_name) AS owner_name,
--     u.email
-- FROM Banks b
-- JOIN Users u ON b.user_id = u.user_id;

-- Query 4: Recent transaction activity (last 30 days)
-- SELECT * FROM user_transaction_history
-- WHERE transaction_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
-- ORDER BY transaction_date DESC;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

-- Notes for MySQL Workbench:
-- 1. To import: File → Run SQL Script → Select this file
-- 2. To create ER diagram: Database → Reverse Engineer → Select horizon_banking
-- 3. Stored procedures and triggers are simplified for compatibility
-- 4. Use the original schema.sql for MySQL command-line if needed
