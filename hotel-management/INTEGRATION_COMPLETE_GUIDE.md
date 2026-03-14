# Hướng Dẫn Tích Hợp Hoàn Chỉnh - Hotel Management System

## Tổng Quan

Đã hoàn thành tích hợp đầy đủ giữa frontend React và backend Spring Boot cho hệ thống quản lý khách sạn. Tất cả các chức năng admin đã được kết nối với API thực tế.

## Các Module Đã Tích Hợp

### 1. Module Đặt Phòng (Bookings)

**Frontend:** `frontend/src/pages/bookings/BookingsPage.jsx`
**API Client:** `frontend/src/api/bookingApi.js`
**Backend:** `src/main/java/com/hotel/management/controller/BookingController.java`

**Chức năng:**
- ✅ Xem danh sách tất cả đặt phòng
- ✅ Lọc theo trạng thái (PENDING, CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED)
- ✅ Tìm kiếm theo tên khách hoặc số phòng
- ✅ Cập nhật trạng thái đặt phòng
  - Xác nhận đặt phòng (PENDING → CONFIRMED)
  - Nhận phòng (CONFIRMED → CHECKED_IN)
  - Trả phòng (CHECKED_IN → CHECKED_OUT)
  - Hủy đặt phòng (PENDING/CONFIRMED → CANCELLED)
- ✅ Xóa đặt phòng
- ✅ Hiển thị thống kê theo trạng thái

**API Endpoints:**
```
GET    /api/v1/bookings                    - Lấy tất cả đặt phòng
GET    /api/v1/bookings/{id}               - Lấy đặt phòng theo ID
GET    /api/v1/bookings/status/{status}    - Lọc theo trạng thái
POST   /api/v1/bookings                    - Tạo đặt phòng mới
PUT    /api/v1/bookings/{id}               - Cập nhật đặt phòng
PATCH  /api/v1/bookings/{id}/status/{status} - Cập nhật trạng thái
DELETE /api/v1/bookings/{id}               - Xóa đặt phòng
```

### 2. Module Hóa Đơn (Invoices)

**Frontend:** `frontend/src/pages/invoices/InvoicesPage.jsx`
**API Client:** `frontend/src/api/invoiceApi.js`
**Backend:** `src/main/java/com/hotel/management/controller/InvoiceController.java`

**Chức năng:**
- ✅ Xem danh sách tất cả hóa đơn
- ✅ Lọc theo trạng thái (PENDING, PAID, PARTIALLY_PAID, OVERDUE, CANCELLED)
- ✅ Tìm kiếm theo số hóa đơn hoặc mã đặt phòng
- ✅ Đánh dấu đã thanh toán
  - Thanh toán bằng tiền mặt (CASH)
  - Thanh toán bằng chuyển khoản (BANK_TRANSFER)
- ✅ Xóa hóa đơn
- ✅ Hiển thị thống kê doanh thu

**API Endpoints:**
```
GET    /api/v1/invoices                    - Lấy tất cả hóa đơn
GET    /api/v1/invoices/{id}               - Lấy hóa đơn theo ID
GET    /api/v1/invoices/status/{status}    - Lọc theo trạng thái
GET    /api/v1/invoices/unpaid             - Lấy hóa đơn chưa thanh toán
POST   /api/v1/invoices                    - Tạo hóa đơn mới
PUT    /api/v1/invoices/{id}               - Cập nhật hóa đơn
PATCH  /api/v1/invoices/{id}/mark-as-paid/{paymentMethod} - Đánh dấu đã thanh toán
DELETE /api/v1/invoices/{id}               - Xóa hóa đơn
```

### 3. Module Tải Ảnh Phòng (Room Image Upload)

**Frontend:** `frontend/src/pages/rooms/RoomsPage.jsx`
**API Client:** `frontend/src/api/roomApi.js`
**Backend:** `src/main/java/com/hotel/management/controller/RoomController.java`

**Chức năng:**
- ✅ Tải ảnh phòng lên từ trình duyệt
- ✅ Xem trước ảnh trước khi tải lên
- ✅ Lưu trữ ảnh trong thư mục `uploads/rooms/{roomId}/`
- ✅ Hiển thị ảnh phòng trong danh sách
- ✅ Phục vụ ảnh tĩnh qua URL `/uploads/**`

**API Endpoints:**
```
POST   /api/v1/rooms/{id}/upload-image     - Tải ảnh phòng lên
GET    /api/v1/rooms/{id}/image            - Lấy URL ảnh phòng
GET    /uploads/rooms/{roomId}/{filename}  - Truy cập ảnh tĩnh
```

**Cấu hình:**
- File upload được lưu trong: `uploads/rooms/{roomId}/`
- Kích thước tối đa: 5MB
- Định dạng hỗ trợ: Tất cả định dạng ảnh (image/*)
- Static resource handler đã được cấu hình trong `WebConfig.java`

## Cấu Trúc File

### Backend
```
src/main/java/com/hotel/management/
├── controller/
│   ├── BookingController.java      (Đã cập nhật)
│   ├── InvoiceController.java      (Đã cập nhật)
│   └── RoomController.java         (Đã thêm image upload)
├── config/
│   └── WebConfig.java              (Đã thêm static resource handler)
└── dto/
    ├── BookingDTO.java
    └── InvoiceDTO.java
```

### Frontend
```
frontend/src/
├── api/
│   ├── bookingApi.js               (Mới)
│   ├── invoiceApi.js               (Mới)
│   └── roomApi.js                  (Đã cập nhật)
└── pages/
    ├── bookings/
    │   └── BookingsPage.jsx        (Đã tích hợp API)
    ├── invoices/
    │   └── InvoicesPage.jsx        (Đã tích hợp API)
    └── rooms/
        └── RoomsPage.jsx           (Đã thêm image upload)
```

## Hướng Dẫn Sử Dụng

### 1. Khởi Động Backend

```bash
# Biên dịch project
./mvnw clean compile

# Chạy ứng dụng
./mvnw spring-boot:run
```

Backend sẽ chạy tại: `http://localhost:8080`

### 2. Khởi Động Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

### 3. Sử Dụng Các Chức Năng

#### Quản Lý Đặt Phòng
1. Truy cập menu "Đặt Phòng"
2. Xem danh sách đặt phòng
3. Lọc theo trạng thái hoặc tìm kiếm
4. Cập nhật trạng thái:
   - Click "Xác nhận" để xác nhận đặt phòng
   - Click "Nhận phòng" khi khách đến
   - Click "Trả phòng" khi khách trả phòng
   - Click "Hủy" để hủy đặt phòng
5. Click "Xóa" để xóa đặt phòng

#### Quản Lý Hóa Đơn
1. Truy cập menu "Hóa Đơn"
2. Xem danh sách hóa đơn và thống kê doanh thu
3. Lọc theo trạng thái hoặc tìm kiếm
4. Đánh dấu đã thanh toán:
   - Click "Tiền mặt" để thanh toán bằng tiền mặt
   - Click "CK" để thanh toán bằng chuyển khoản
5. Click "Xóa" để xóa hóa đơn

#### Tải Ảnh Phòng
1. Truy cập menu "Phòng"
2. Click "Thêm Phòng"
3. Điền thông tin phòng
4. Click "Chọn file" trong phần "Ảnh Phòng"
5. Chọn ảnh từ máy tính (tối đa 5MB)
6. Xem trước ảnh
7. Click "Tạo Phòng"
8. Ảnh sẽ được tải lên và hiển thị trong danh sách

## Trạng Thái và Luồng Xử Lý

### Trạng Thái Đặt Phòng
```
PENDING → CONFIRMED → CHECKED_IN → CHECKED_OUT
   ↓
CANCELLED
```

### Trạng Thái Hóa Đơn
```
PENDING → PAID
   ↓
OVERDUE
   ↓
CANCELLED
```

## Lưu Ý Quan Trọng

### 1. CORS
- Backend đã cấu hình CORS cho `localhost:5173` (Vite) và `localhost:3000` (React)
- Nếu chạy trên port khác, cần cập nhật `WebConfig.java`

### 2. Lưu Trữ Ảnh
- Ảnh được lưu trong thư mục `uploads/` tại thư mục gốc project
- Thư mục này sẽ được tạo tự động khi tải ảnh lên
- Đảm bảo ứng dụng có quyền ghi vào thư mục này

### 3. URL Ảnh
- Ảnh được phục vụ qua URL: `http://localhost:8080/uploads/rooms/{roomId}/{filename}`
- Frontend tự động thêm base URL khi hiển thị ảnh

### 4. Validation
- Tất cả API đều có validation
- Frontend hiển thị thông báo lỗi rõ ràng
- Backend trả về thông báo lỗi bằng tiếng Anh (có thể dịch sang tiếng Việt nếu cần)

## Kiểm Tra Chức Năng

### 1. Kiểm Tra Backend
```bash
# Kiểm tra backend đang chạy
curl http://localhost:8080/api/v1/bookings

# Kiểm tra static file serving
# (sau khi tải ảnh lên)
curl http://localhost:8080/uploads/rooms/1/example.jpg
```

### 2. Kiểm Tra Frontend
1. Mở trình duyệt tại `http://localhost:5173`
2. Đăng nhập với tài khoản admin
3. Kiểm tra từng module:
   - Đặt Phòng: Xem, lọc, cập nhật trạng thái
   - Hóa Đơn: Xem, lọc, đánh dấu đã thanh toán
   - Phòng: Tạo phòng mới với ảnh

## Xử Lý Lỗi

### Lỗi Thường Gặp

1. **Không tải được ảnh**
   - Kiểm tra thư mục `uploads/` có tồn tại
   - Kiểm tra quyền ghi file
   - Kiểm tra kích thước file (< 5MB)

2. **CORS Error**
   - Kiểm tra backend đang chạy
   - Kiểm tra cấu hình CORS trong `WebConfig.java`
   - Kiểm tra port frontend

3. **API Error**
   - Mở Developer Tools (F12)
   - Kiểm tra tab Network
   - Xem response từ backend

## Tính Năng Tiếp Theo (Tùy Chọn)

- [ ] Thêm chức năng tạo đặt phòng mới từ UI
- [ ] Thêm chức năng tạo hóa đơn mới từ UI
- [ ] Thêm chức năng sửa thông tin đặt phòng
- [ ] Thêm chức năng sửa thông tin hóa đơn
- [ ] Thêm chức năng xem chi tiết đặt phòng/hóa đơn
- [ ] Thêm chức năng in hóa đơn
- [ ] Thêm chức năng tải nhiều ảnh cho một phòng
- [ ] Thêm chức năng xóa/thay thế ảnh phòng

## Kết Luận

Hệ thống đã được tích hợp hoàn chỉnh với các chức năng:
- ✅ Quản lý đặt phòng với API thực tế
- ✅ Quản lý hóa đơn với API thực tế
- ✅ Tải ảnh phòng từ trình duyệt
- ✅ Tất cả UI đã được dịch sang tiếng Việt
- ✅ Backend biên dịch thành công
- ✅ CORS đã được cấu hình
- ✅ Static file serving đã được cấu hình

Hệ thống sẵn sàng cho demo đồ án tốt nghiệp!
