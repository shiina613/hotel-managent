-- ============================================================
-- BƯỚC 1: Đổi enum role trong bảng users
-- Từ: ADMIN, CUSTOMER, MANAGER, STAFF
-- Sang: ADMIN, RECEPTIONIST, CUSTOMER
-- ============================================================

ALTER TABLE users
  MODIFY COLUMN role ENUM('ADMIN','RECEPTIONIST','CUSTOMER') NOT NULL;

-- ============================================================
-- BƯỚC 2: Thêm 9 tài khoản test (username = password)
-- 3 ADMIN, 3 RECEPTIONIST, 3 CUSTOMER
-- (GUEST không cần đăng nhập nên không tạo tài khoản)
-- ============================================================

INSERT INTO users (create_at, email, full_name, password, phone, role, status, update_at, username) VALUES
-- ADMIN accounts
('2026-01-01 00:00:00', 'admin1@hotel.com', 'Admin Một', 'admin1', '0900000001', 'ADMIN', 'ACTIVE', '2026-01-01 00:00:00', 'admin1'),
('2026-01-01 00:00:00', 'admin2@hotel.com', 'Admin Hai', 'admin2', '0900000002', 'ADMIN', 'ACTIVE', '2026-01-01 00:00:00', 'admin2'),
('2026-01-01 00:00:00', 'admin3@hotel.com', 'Admin Ba',  'admin3', '0900000003', 'ADMIN', 'ACTIVE', '2026-01-01 00:00:00', 'admin3'),

-- RECEPTIONIST accounts
('2026-01-01 00:00:00', 'recep1@hotel.com', 'Lễ Tân Một', 'recep1', '0900000011', 'RECEPTIONIST', 'ACTIVE', '2026-01-01 00:00:00', 'recep1'),
('2026-01-01 00:00:00', 'recep2@hotel.com', 'Lễ Tân Hai', 'recep2', '0900000012', 'RECEPTIONIST', 'ACTIVE', '2026-01-01 00:00:00', 'recep2'),
('2026-01-01 00:00:00', 'recep3@hotel.com', 'Lễ Tân Ba',  'recep3', '0900000013', 'RECEPTIONIST', 'ACTIVE', '2026-01-01 00:00:00', 'recep3'),

-- CUSTOMER accounts
('2026-01-01 00:00:00', 'user1@hotel.com', 'Khách Hàng Một', 'user1', '0900000021', 'CUSTOMER', 'ACTIVE', '2026-01-01 00:00:00', 'user1'),
('2026-01-01 00:00:00', 'user2@hotel.com', 'Khách Hàng Hai', 'user2', '0900000022', 'CUSTOMER', 'ACTIVE', '2026-01-01 00:00:00', 'user2'),
('2026-01-01 00:00:00', 'user3@hotel.com', 'Khách Hàng Ba',  'user3', '0900000023', 'CUSTOMER', 'ACTIVE', '2026-01-01 00:00:00', 'user3');

-- ============================================================
-- Tóm tắt tài khoản test:
-- ADMIN:        admin1/admin1 | admin2/admin2 | admin3/admin3
-- RECEPTIONIST: recep1/recep1 | recep2/recep2 | recep3/recep3
-- CUSTOMER:     user1/user1   | user2/user2   | user3/user3
-- ============================================================
