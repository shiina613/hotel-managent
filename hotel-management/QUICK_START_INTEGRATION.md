# Quick Start - Hệ Thống Đã Tích Hợp Hoàn Chỉnh

## Chạy Hệ Thống

### 1. Khởi động Backend (Terminal 1)
```bash
./mvnw spring-boot:run
```
✅ Backend chạy tại: http://localhost:8080

### 2. Khởi động Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
✅ Frontend chạy tại: http://localhost:5173

### 3. Truy cập hệ thống
Mở trình duyệt: http://localhost:5173

## Các Chức Năng Mới

### ✅ Module Đặt Phòng (Bookings)
**Đường dẫn:** Menu → Đặt Phòng

**Thao tác:**
- Xem danh sách đặt phòng
- Lọc theo trạng thái
- Tìm kiếm theo tên khách/số phòng
- **Xác nhận** đặt phòng (PENDING → CONFIRMED)
- **Nhận phòng** (CONFIRMED → CHECKED_IN)
- **Trả phòng** (CHECKED_IN → CHECKED_OUT)
- **Hủy** đặt phòng
- **Xóa** đặt phòng

### ✅ Module Hóa Đơn (Invoices)
**Đường dẫn:** Menu → Hóa Đơn

**Thao tác:**
- Xem danh sách hóa đơn
- Lọc theo trạng thái
- Tìm kiếm theo số hóa đơn
- **Đánh dấu đã thanh toán:**
  - Click "Tiền mặt" → Thanh toán bằng tiền mặt
  - Click "CK" → Thanh toán bằng chuyển khoản
- **Xóa** hóa đơn
- Xem thống kê doanh thu

### ✅ Tải Ảnh Phòng (Room Image Upload)
**Đường dẫn:** Menu → Phòng → Thêm Phòng

**Thao tác:**
1. Click "Thêm Phòng"
2. Điền thông tin phòng
3. Click "Chọn file" trong phần "Ảnh Phòng"
4. Chọn ảnh từ máy tính (tối đa 5MB)
5. Xem trước ảnh
6. Click "Tạo Phòng"
7. ✅ Ảnh được tải lên và hiển thị trong danh sách

## Kiểm Tra Nhanh

### Test 1: Đặt Phòng
1. Vào menu "Đặt Phòng"
2. Thấy danh sách đặt phòng từ database
3. Click "Xác nhận" trên một đặt phòng PENDING
4. ✅ Trạng thái chuyển sang CONFIRMED

### Test 2: Hóa Đơn
1. Vào menu "Hóa Đơn"
2. Thấy danh sách hóa đơn và thống kê doanh thu
3. Click "Tiền mặt" trên một hóa đơn PENDING
4. ✅ Trạng thái chuyển sang PAID

### Test 3: Tải Ảnh Phòng
1. Vào menu "Phòng"
2. Click "Thêm Phòng"
3. Điền thông tin và chọn ảnh
4. Click "Tạo Phòng"
5. ✅ Phòng mới xuất hiện với ảnh thumbnail

## Xử Lý Lỗi Thường Gặp

### Lỗi: "Không thể tải danh sách..."
**Nguyên nhân:** Backend chưa chạy hoặc database chưa có dữ liệu
**Giải pháp:**
1. Kiểm tra backend đang chạy: http://localhost:8080
2. Kiểm tra database có dữ liệu mẫu

### Lỗi: "CORS Error"
**Nguyên nhân:** Backend chưa chạy hoặc port không đúng
**Giải pháp:**
1. Đảm bảo backend chạy tại port 8080
2. Đảm bảo frontend chạy tại port 5173

### Lỗi: "Không thể tải ảnh lên"
**Nguyên nhân:** File quá lớn hoặc không phải ảnh
**Giải pháp:**
1. Chọn file ảnh (jpg, png, gif, etc.)
2. Đảm bảo file < 5MB

## Files Quan Trọng

### Backend
- `RoomController.java` - Đã thêm image upload endpoints
- `WebConfig.java` - Đã cấu hình static file serving

### Frontend
- `bookingApi.js` - API client cho đặt phòng (MỚI)
- `invoiceApi.js` - API client cho hóa đơn (MỚI)
- `roomApi.js` - Đã thêm image upload functions
- `BookingsPage.jsx` - Đã tích hợp API
- `InvoicesPage.jsx` - Đã tích hợp API
- `RoomsPage.jsx` - Đã thêm image upload UI

## Trạng Thái Hệ Thống

✅ Backend: Biên dịch thành công
✅ Frontend: Không có lỗi
✅ API Integration: Hoàn chỉnh
✅ Image Upload: Hoạt động
✅ UI: Tiếng Việt hoàn chỉnh
✅ Sẵn sàng demo!

## Liên Hệ Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra console (F12)
2. Kiểm tra Network tab (F12 → Network)
3. Đọc file `INTEGRATION_COMPLETE_GUIDE.md` để biết chi tiết

---

**Chúc bạn demo thành công! 🎉**
