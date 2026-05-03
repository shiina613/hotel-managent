# Hotel Management System

Hệ thống quản lý khách sạn full-stack với Spring Boot 3 (backend) và React 19 (frontend). Hỗ trợ 3 role: **Admin**, **Receptionist**, **Customer**.

---

## Công nghệ sử dụng

| Layer | Công nghệ |
|---|---|
| Backend | Spring Boot 3.5, Spring Security 6, JWT (JJWT 0.12.6), JPA/Hibernate |
| Database | MySQL 8 |
| Frontend | React 19, Vite 8, Tailwind CSS 3, Recharts, Axios |
| Build | Maven (mvnw), Node.js |
| Docs | SpringDoc OpenAPI 3 / Swagger UI |

---

## Yêu cầu hệ thống

- Java 17+
- Node.js 18+
- MySQL 8+
- Maven (hoặc dùng `mvnw` đi kèm)

---

## Cài đặt và chạy

### 1. Tạo database

```sql
CREATE DATABASE hotel_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Cấu hình biến môi trường

Sao chép file mẫu và điền giá trị thật:

```bash
cp hotel-management/.env.example hotel-management/.env
```

Nội dung `.env`:

```env
DB_URL=jdbc:mysql://localhost:3306/hotel_management
DB_USERNAME=root
DB_PASSWORD=your_password

# Tối thiểu 32 ký tự — bắt buộc
JWT_SECRET=your_super_secret_key_at_least_32_chars
JWT_EXPIRATION=86400000

LOG_LEVEL=INFO
```

> **Lưu ý:** `JWT_SECRET` phải có ít nhất 32 ký tự. Nếu thiếu, ứng dụng sẽ từ chối khởi động.

### 3. Chạy Backend

```bash
cd hotel-management
./mvnw spring-boot:run
```

Backend khởi động tại `http://localhost:8080`.

Khi khởi động lần đầu, Hibernate tự tạo bảng (`ddl-auto=update`). `PasswordMigrationRunner` sẽ tự động mã hóa BCrypt các tài khoản có mật khẩu plain text còn tồn tại trong DB.

### 4. Chạy Frontend

```bash
cd hotel-management/frontend
npm install
npm run dev
```

Frontend chạy tại `http://localhost:5173`.

---

## Tài khoản test

| Role | Username | Password | Họ tên |
|---|---|---|---|
| Admin | `admin2` | `Admin@123` | Nguyen Quan Tri |
| Receptionist | `letan01` | `Letan@123` | Tran Thi Le Tan |
| Customer | `khachhang01` | `Kh@123456` | Le Van An |
| Customer | `khachhang02` | `Kh@123456` | Pham Thi Bich |
| Customer | `khachhang03` | `Kh@123456` | Nguyen Minh Tuan |
| Customer | `khachhang04` | `Kh@123456` | Hoang Thi Mai |

---

## Cấu trúc dự án

```
hotel-management/
├── src/main/java/com/hotel/management/
│   ├── config/
│   │   ├── SecurityConfig.java        # Spring Security 6, CORS, JWT filter chain
│   │   ├── JwtAuthFilter.java         # OncePerRequestFilter — validate Bearer token
│   │   └── OpenApiConfig.java         # Swagger/OpenAPI config
│   ├── security/
│   │   ├── JwtService.java            # Generate/validate JWT
│   │   └── PasswordMigrationRunner.java # Migrate plain text → BCrypt khi startup
│   ├── controller/                    # 8 controllers (Auth, User, Room, RoomType,
│   │                                  #   Booking, Invoice, Service, Dashboard)
│   ├── service/                       # Business logic interfaces + implementations
│   ├── repository/                    # Spring Data JPA repositories
│   ├── entity/                        # JPA entities (User, Room, Booking, Invoice…)
│   ├── dto/                           # Request/Response DTOs với validation
│   ├── exception/                     # GlobalExceptionHandler, custom exceptions
│   └── filter/                        # RequestLoggingFilter
├── src/main/resources/
│   ├── application.properties         # Cấu hình qua env variables
│   └── logback-spring.xml             # Console + file logging, rolling 30 ngày
└── frontend/
    ├── src/
    │   ├── api/                       # axiosClient + 8 API modules
    │   ├── components/
    │   │   ├── dashboard/             # SummaryCards, RevenueChart, BookingStatusChart
    │   │   ├── layout/                # AdminLayout, Sidebar
    │   │   └── ui/                    # Modal, Toast, Pagination, Skeleton, ErrorBoundary
    │   ├── pages/                     # 14 trang (auth, dashboard, rooms, bookings…)
    │   └── routes/                    # ProtectedRoute
    └── package.json
```

---

## API Endpoints

Swagger UI: `http://localhost:8080/swagger-ui.html`

### Xác thực (public)

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/v1/auth/login` | Đăng nhập, trả JWT token |
| POST | `/api/v1/auth/register` | Đăng ký tài khoản Customer |
| POST | `/api/v1/auth/forgot-password` | Đặt lại mật khẩu qua câu hỏi bảo mật |

### Người dùng (ADMIN)

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/v1/users` | Danh sách users (phân trang) |
| POST | `/api/v1/users` | Tạo user mới |
| PUT | `/api/v1/users/{id}` | Cập nhật user |
| DELETE | `/api/v1/users/{id}` | Xóa user |
| PUT | `/api/v1/users/{id}/reset-password` | Admin reset mật khẩu |
| GET | `/api/v1/users/me` | Thông tin user hiện tại |
| PUT | `/api/v1/users/me` | Cập nhật fullName, phone |
| GET | `/api/v1/users/me/bookings` | Bookings của user hiện tại |
| GET | `/api/v1/users/me/invoices` | Invoices của user hiện tại |

### Phòng

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/v1/rooms` | Danh sách phòng (phân trang) |
| POST | `/api/v1/rooms` | Tạo phòng (ADMIN/RECEPTIONIST) |
| PUT | `/api/v1/rooms/{id}` | Cập nhật phòng (ADMIN/RECEPTIONIST) |
| DELETE | `/api/v1/rooms/{id}` | Xóa phòng (ADMIN/RECEPTIONIST) |

### Đặt phòng

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/v1/bookings` | Danh sách bookings (phân trang, có filter) |
| POST | `/api/v1/bookings` | Tạo booking mới (status = PENDING) |
| PUT | `/api/v1/bookings/{id}/status` | Cập nhật trạng thái (state machine) |
| PUT | `/api/v1/bookings/{id}/cancel` | Hủy booking |

### Dashboard (ADMIN only)

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/v1/dashboard/summary` | Tổng quan: doanh thu, booking, phòng |
| GET | `/api/v1/dashboard/revenue` | Doanh thu theo ngày/tháng |
| GET | `/api/v1/dashboard/bookings/stats` | Thống kê booking theo trạng thái |
| GET | `/api/v1/dashboard/rooms/occupancy` | Tỷ lệ lấp đầy phòng |
| GET | `/api/v1/dashboard/services/top` | Top 5 dịch vụ |

---

## Phân quyền

| Endpoint | ADMIN | RECEPTIONIST | CUSTOMER |
|---|:---:|:---:|:---:|
| `/api/v1/auth/**` | ✅ | ✅ | ✅ |
| `/api/v1/dashboard/**` | ✅ | ❌ | ❌ |
| `GET /api/v1/users/**` | ✅ | ❌ | ❌ |
| `POST/PUT/DELETE /api/v1/rooms/**` | ✅ | ✅ | ❌ |
| `PUT /api/v1/bookings/**` | ✅ | ✅ | ❌ |
| `GET /api/v1/rooms`, `GET /api/v1/bookings` | ✅ | ✅ | ✅ |
| `/api/v1/users/me/**` | ✅ | ✅ | ✅ |

---

## Booking State Machine

```
PENDING ──→ CONFIRMED ──→ CHECKED_IN ──→ CHECKED_OUT
   │              │                           (auto-tạo Invoice)
   └──────────────┴──────────→ CANCELLED
```

- **PENDING → CONFIRMED**: RECEPTIONIST / ADMIN
- **CONFIRMED → CHECKED_IN**: RECEPTIONIST / ADMIN
- **CHECKED_IN → CHECKED_OUT**: RECEPTIONIST / ADMIN — tự động tạo Invoice
- **PENDING/CONFIRMED → CANCELLED**: bất kỳ role (Customer chỉ hủy booking của mình)

---

## Tính năng chính

### Bảo mật
- Mật khẩu mã hóa BCrypt (strength 12)
- JWT stateless, hết hạn sau 24h
- Spring Security 6 với lambda DSL
- CORS cấu hình cho `localhost:3000` và `localhost:5173`
- Câu hỏi bảo mật để reset mật khẩu không cần email

### Backend
- Pagination trên tất cả list API (`page`, `size`, tối đa 100)
- Conflict check khi tạo booking (tránh double-booking)
- Auto-tạo Invoice khi check-out (idempotent)
- Global exception handler trả JSON chuẩn
- Request logging (method, URL, IP, user, thời gian xử lý)
- Swagger UI với Bearer Auth support

### Frontend
- Inline validation on blur cho form Login, Register, Booking
- Hiển thị lỗi từ API theo từng field (`fieldErrors`)
- Skeleton loading trên tất cả trang danh sách và Dashboard
- Error Boundary bọc mỗi route — fallback UI với nút "Tải lại trang"
- Toast notification cho success/error
- Pagination component với thông tin "Hiển thị X-Y trong Z bản ghi"
- Dashboard với biểu đồ doanh thu (LineChart) và trạng thái booking (PieChart)

---

## Logging

Log được ghi ra:
- Console (stdout)
- File: `hotel-management/logs/hotel-management.log` (rolling theo ngày, giữ 30 ngày)

Cấu hình log level qua biến môi trường `LOG_LEVEL` (mặc định `INFO`).

---

## Format response API

### Thành công
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

### Lỗi validation
```json
{
  "success": false,
  "message": "Validation failed",
  "fieldErrors": [
    { "field": "email", "message": "Email không đúng định dạng" },
    { "field": "password", "message": "Mật khẩu phải có ít nhất 8 ký tự" }
  ]
}
```

### Lỗi nghiệp vụ
```json
{
  "success": false,
  "message": "Phòng đã được đặt trong khoảng thời gian này"
}
```
