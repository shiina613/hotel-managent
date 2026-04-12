-- Auto migration: update role enum to new values
-- Safe to run multiple times

-- Step 1: convert old roles to new ones
UPDATE users SET role = 'RECEPTIONIST' WHERE role IN ('STAFF', 'MANAGER');
UPDATE users SET role = 'CUSTOMER' WHERE role NOT IN ('ADMIN', 'RECEPTIONIST', 'CUSTOMER');

-- Step 2: alter enum column
ALTER TABLE users
  MODIFY COLUMN role ENUM('ADMIN','RECEPTIONIST','CUSTOMER') NOT NULL;
