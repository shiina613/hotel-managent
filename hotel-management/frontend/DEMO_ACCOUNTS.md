# 📋 Tài Khoản Demo - Hệ Thống Quản Lý Khách Sạn

## 🎯 Tổng Quan

Hệ thống hiện tại sử dụng **mock authentication** cho mục đích demo. Tất cả tài khoản được lưu trữ trong `src/api/authApi.js` và không cần backend.

## 👥 Danh Sách Tài Khoản Demo

### 1️⃣ Tài Khoản Admin (Quản Trị Viên)

```
Tên đăng nhập: admin001
Mật khẩu:      admin123
Họ tên:        Nguyễn Văn Admin
Email:         admin@luxuryhotel.com
Vai trò:       ADMIN
```

**Quyền truy cập:**
- Dashboard - Xem tổng quan hệ thống
- Quản lý loại phòng
- Quản lý phòng
- Quản lý dịch vụ
- Quản lý đặt phòng
- Quản lý hóa đơn

**Trang chính:** `/dashboard`

---

### 2️⃣ Tài Khoản Lễ Tân (Receptionist)

```
Tên đăng nhập: receptionist001
Mật khẩu:      receptionist123
Họ tên:        Trần Thị Lễ Tân
Email:         receptionist@luxuryhotel.com
Vai trò:       RECEPTIONIST
```

**Quyền truy cập:**
- Trang lễ tân - Dashboard riêng
- Quản lý đặt phòng
- Quản lý phòng
- Quản lý dịch vụ
- Quản lý hóa đơn
- Quản lý loại phòng

**Trang chính:** `/receptionist`

---

### 3️⃣ Tài Khoản Khách Hàng (Customer)

```
Tên đăng nhập: customer001
Mật khẩu:      customer123
Họ tên:        Phạm Minh Khách
Email:         customer@luxuryhotel.com
Vai trò:       CUSTOMER
```

**Quyền truy cập:**
- Trang chủ khách hàng
- Xem thông tin tài khoản
- Xem lịch sử đặt phòng
- Xem lịch sử hóa đơn
- Xem các dịch vụ

**Trang chính:** `/home`

---

## 🔐 Cách Đăng Nhập

### Bước 1: Truy cập trang đăng nhập
```
http://localhost:5173/login
```

### Bước 2: Nhập thông tin
- Chọn một tài khoản từ danh sách trên
- Nhập tên đăng nhập
- Nhập mật khẩu

### Bước 3: Nhấn "Đăng Nhập"
- Hệ thống sẽ xác thực thông tin
- Nếu đúng, sẽ điều hướng đến trang phù hợp với vai trò

---

## 🔄 Luồng Đăng Nhập

```
Trang Login
    ↓
Nhập thông tin
    ↓
Xác thực (Mock)
    ↓
Lưu token & user info vào localStorage
    ↓
Điều hướng dựa trên role:
    ├─ ADMIN → /dashboard
    ├─ RECEPTIONIST → /receptionist
    └─ CUSTOMER → /home
```

---

## 📝 Thông Tin Lưu Trữ

Sau khi đăng nhập thành công, hệ thống lưu trữ:

```javascript
// localStorage.token
"token_admin_demo_12345"

// localStorage.user
{
  userId: "admin001",
  username: "admin001",
  fullName: "Nguyễn Văn Admin",
  email: "admin@luxuryhotel.com",
  role: "ADMIN"
}
```

---

## 🧪 Kiểm Tra Đăng Nhập

### Cách kiểm tra trong Browser Console (F12)

```javascript
// Xem token
localStorage.getItem('token')

// Xem thông tin user
JSON.parse(localStorage.getItem('user'))

// Xóa session (đăng xuất)
localStorage.removeItem('token')
localStorage.removeItem('user')
```

---

## ⚙️ Cấu Hình Mock Authentication

File: `src/api/authApi.js`

```javascript
const mockUsers = [
  {
    userId: 'admin001',
    username: 'admin001',
    password: 'admin123',
    fullName: 'Nguyễn Văn Admin',
    email: 'admin@luxuryhotel.com',
    role: 'ADMIN',
    token: 'token_admin_demo_12345'
  },
  // ... các tài khoản khác
];
```

### Thêm Tài Khoản Mới

Để thêm tài khoản demo mới, chỉnh sửa mảng `mockUsers`:

```javascript
{
  userId: 'newuser001',
  username: 'newuser001',
  password: 'newuser123',
  fullName: 'Tên Người Dùng',
  email: 'newuser@luxuryhotel.com',
  role: 'ADMIN', // hoặc RECEPTIONIST, CUSTOMER
  token: 'token_newuser_demo_12345'
}
```

---

## 🔄 Chuyển Sang Backend Thực

Khi sẵn sàng kết nối backend thực:

### 1. Cập nhật `authApi.js`

Thay thế hàm `login` mock bằng:

```javascript
login: (credentials) => {
  return axiosClient.post('/auth/login', credentials);
}
```

### 2. Xóa mock users

Xóa mảng `mockUsers` khỏi file

### 3. Cập nhật backend

Đảm bảo backend trả về response với cấu trúc:

```json
{
  "success": true,
  "data": {
    "userId": "...",
    "username": "...",
    "fullName": "...",
    "email": "...",
    "role": "ADMIN|RECEPTIONIST|CUSTOMER",
    "token": "..."
  }
}
```

---

## 🐛 Troubleshooting

### Vấn đề: Không thể đăng nhập

**Nguyên nhân:** Tên đăng nhập hoặc mật khẩu sai

**Giải pháp:**
1. Kiểm tra lại tên đăng nhập (phân biệt chữ hoa/thường)
2. Kiểm tra lại mật khẩu
3. Xem console (F12) để xem lỗi chi tiết

### Vấn đề: Bị redirect liên tục

**Nguyên nhân:** Token không hợp lệ

**Giải pháp:**
1. Xóa localStorage: `localStorage.clear()`
2. Làm mới trang: `Ctrl+F5`
3. Đăng nhập lại

### Vấn đề: Không thể truy cập trang sau khi đăng nhập

**Nguyên nhân:** Vai trò không khớp

**Giải pháp:**
1. Kiểm tra vai trò trong localStorage
2. Đảm bảo route được bảo vệ đúng
3. Xem console để xem lỗi

---

## 📚 Tài Liệu Liên Quan

- [ROLE_BASED_ACCESS_GUIDE.md](./ROLE_BASED_ACCESS_GUIDE.md) - Hướng dẫn phân quyền
- [src/api/authApi.js](./src/api/authApi.js) - Mã xác thực
- [src/pages/auth/LoginPage.jsx](./src/pages/auth/LoginPage.jsx) - Trang đăng nhập
- [src/routes/ProtectedRoute.jsx](./src/routes/ProtectedRoute.jsx) - Bảo vệ route

---

## 💡 Mẹo

1. **Ghi nhớ tài khoản:** Sử dụng tài khoản admin để test toàn bộ tính năng
2. **Test phân quyền:** Dùng 3 tài khoản khác nhau để kiểm tra quyền truy cập
3. **Xóa cache:** Nếu gặp vấn đề, xóa localStorage và làm mới trang
4. **Kiểm tra console:** Luôn mở F12 để xem lỗi chi tiết

---

**Chúc bạn demo thành công! 🎉**
