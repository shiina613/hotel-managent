# Hướng Dẫn Hệ Thống Phân Quyền (Role-Based Access Control)

## Tổng Quan

Hệ thống quản lý khách sạn hiện tại hỗ trợ 3 vai trò chính với các quyền và trang riêng biệt:

1. **ADMIN** - Quản trị viên
2. **RECEPTIONIST** - Lễ tân
3. **CUSTOMER** - Khách hàng

## Chi Tiết Các Vai Trò

### 1. ADMIN (Quản Trị Viên)

**Trang chính:** `/dashboard`

**Quyền truy cập:**
- Dashboard - Xem tổng quan hệ thống
- Quản lý loại phòng (`/room-types`)
- Quản lý phòng (`/rooms`)
- Quản lý dịch vụ (`/services`)
- Quản lý đặt phòng (`/bookings`)
- Quản lý hóa đơn (`/invoices`)

**Tính năng:**
- Toàn quyền quản lý tất cả các module
- Xem báo cáo và thống kê
- Quản lý người dùng và quyền hạn

### 2. RECEPTIONIST (Lễ Tân)

**Trang chính:** `/receptionist`

**Quyền truy cập:**
- Trang lễ tân (`/receptionist`) - Dashboard riêng cho lễ tân
- Quản lý đặt phòng (`/bookings`)
- Quản lý phòng (`/rooms`)
- Quản lý dịch vụ (`/services`)
- Quản lý hóa đơn (`/invoices`)
- Quản lý loại phòng (`/room-types`)

**Tính năng:**
- Tạo và quản lý đặt phòng
- Cập nhật trạng thái phòng
- Quản lý dịch vụ cho khách
- Tạo hóa đơn
- Xem thông tin phòng

### 3. CUSTOMER (Khách Hàng)

**Trang chính:** `/home`

**Quyền truy cập:**
- Trang chủ khách hàng (`/home`)

**Tính năng:**
- Xem thông tin tài khoản
- Xem lịch sử đặt phòng
- Xem lịch sử hóa đơn
- Xem các dịch vụ khách sạn

## Luồng Đăng Nhập

### Quy Trình Đăng Nhập

1. Người dùng truy cập `/login`
2. Nhập tên đăng nhập và mật khẩu
3. Hệ thống xác thực thông tin
4. Lưu token và thông tin người dùng vào localStorage
5. **Điều hướng dựa trên vai trò:**
   - ADMIN → `/dashboard`
   - RECEPTIONIST → `/receptionist`
   - CUSTOMER → `/home`

### Tài Khoản Demo

```
Admin:
- Username: admin001
- Password: admin123
- Role: ADMIN

Receptionist:
- Username: receptionist001
- Password: receptionist123
- Role: RECEPTIONIST

Customer:
- Username: customer001
- Password: customer123
- Role: CUSTOMER
```

## Cấu Trúc Bảo Vệ Route

### ProtectedRoute Component

```jsx
<ProtectedRoute requiredRole="ADMIN">
  <AdminLayout>
    <DashboardPage />
  </AdminLayout>
</ProtectedRoute>
```

**Tính năng:**
- Kiểm tra xác thực (token)
- Kiểm tra vai trò (role)
- Tự động điều hướng nếu không có quyền

### Hành Vi Điều Hướng

Nếu người dùng cố gắng truy cập route không được phép:
- ADMIN cố gắng vào `/receptionist` → Quay lại `/dashboard`
- RECEPTIONIST cố gắng vào `/dashboard` → Quay lại `/receptionist`
- CUSTOMER cố gắng vào `/dashboard` → Quay lại `/home`

## Lưu Trữ Dữ Liệu

### localStorage

```javascript
// Token
localStorage.getItem('token')

// User Info
{
  userId: "...",
  username: "...",
  fullName: "...",
  email: "...",
  role: "ADMIN" | "RECEPTIONIST" | "CUSTOMER"
}
```

## Các File Liên Quan

### Frontend

- `src/pages/auth/LoginPage.jsx` - Trang đăng nhập
- `src/pages/HomePage.jsx` - Trang chủ khách hàng
- `src/pages/ReceptionistPage.jsx` - Trang lễ tân
- `src/pages/DashboardPage.jsx` - Dashboard admin
- `src/routes/ProtectedRoute.jsx` - Component bảo vệ route
- `src/App.jsx` - Cấu hình routing
- `src/api/authApi.js` - API xác thực

## Mở Rộng Hệ Thống

### Thêm Vai Trò Mới

1. Cập nhật backend để hỗ trợ vai trò mới
2. Tạo trang mới cho vai trò (ví dụ: `ManagerPage.jsx`)
3. Thêm route mới trong `App.jsx`
4. Cập nhật logic điều hướng trong `LoginPage.jsx`
5. Cập nhật `ProtectedRoute.jsx` nếu cần

### Thêm Quyền Chi Tiết

Để thêm quyền chi tiết hơn (ví dụ: chỉ xem, chỉnh sửa, xóa):

1. Mở rộng đối tượng user trong localStorage
2. Tạo hook `usePermission` để kiểm tra quyền
3. Sử dụng hook trong các component để ẩn/hiện nút

```javascript
const usePermission = (permission) => {
  const user = authApi.getCurrentUser();
  return user?.permissions?.includes(permission);
};
```

## Đăng Xuất

Khi người dùng đăng xuất:

```javascript
authApi.logout(); // Xóa token và user từ localStorage
navigate('/login'); // Quay lại trang đăng nhập
```

## Bảo Mật

### Các Biện Pháp Bảo Mật Hiện Tại

1. **Token-based Authentication** - Sử dụng JWT token
2. **Role-based Access Control** - Kiểm tra vai trò trước khi cho phép truy cập
3. **Protected Routes** - Tất cả route được bảo vệ bằng ProtectedRoute
4. **localStorage** - Lưu trữ token và thông tin người dùng

### Khuyến Nghị Bảo Mật

1. Sử dụng HTTPS trong production
2. Đặt token trong httpOnly cookie thay vì localStorage
3. Thêm refresh token mechanism
4. Xác thực lại quyền trên backend
5. Thêm logging và monitoring

## Troubleshooting

### Vấn Đề: Người dùng bị redirect liên tục

**Nguyên nhân:** Token hết hạn hoặc không hợp lệ

**Giải pháp:**
1. Xóa localStorage
2. Đăng nhập lại
3. Kiểm tra token trên backend

### Vấn Đề: Không thể truy cập route

**Nguyên nhân:** Vai trò không khớp

**Giải pháp:**
1. Kiểm tra vai trò trong localStorage
2. Xác nhận vai trò trên backend
3. Đăng xuất và đăng nhập lại

### Vấn Đề: Thông tin người dùng không cập nhật

**Nguyên nhân:** localStorage không được làm mới

**Giải pháp:**
1. Xóa localStorage
2. Đăng nhập lại
3. Kiểm tra API response

## Liên Hệ Hỗ Trợ

Nếu gặp vấn đề, vui lòng liên hệ với đội phát triển hoặc kiểm tra logs trong browser console.
