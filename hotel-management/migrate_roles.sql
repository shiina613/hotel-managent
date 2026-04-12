-- Migrate role enum: MANAGER/STAFF -> RECEPTIONIST, bỏ GUEST
-- Chạy file này trong MySQL trước khi restart backend

-- Bước 1: Đổi các giá trị cũ sang RECEPTIONIST
UPDATE users SET role = 'RECEPTIONIST' WHERE role IN ('STAFF', 'MANAGER');

-- Bước 2: Cập nhật lại enum column (chỉ còn 3 giá trị)
ALTER TABLE users
  MODIFY COLUMN role ENUM('ADMIN','RECEPTIONIST','CUSTOMER') NOT NULL;
