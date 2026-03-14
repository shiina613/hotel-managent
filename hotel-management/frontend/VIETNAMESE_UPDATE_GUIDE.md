# Hướng Dẫn Cập Nhật Tiếng Việt

## Tổng Quan

Giao diện quản lý khách sạn đã được cập nhật hoàn toàn sang tiếng Việt và bổ sung tính năng quản lý Loại Phòng.

---

## ✅ Những Gì Đã Cập Nhật

### 1. Chuyển Đổi Sang Tiếng Việt
- ✅ Tất cả tiêu đề trang
- ✅ Tất cả nút bấm
- ✅ Tất cả nhãn form
- ✅ Tất cả placeholder
- ✅ Tất cả tiêu đề bảng
- ✅ Tất cả thông báo lỗi
- ✅ Tất cả trạng thái loading
- ✅ Tất cả empty states
- ✅ Tất cả thông báo validation

### 2. Thêm Quản Lý Loại Phòng
- ✅ Menu mới: "Loại Phòng"
- ✅ Trang RoomTypesPage
- ✅ API roomTypeApi.js
- ✅ Bảng hiển thị loại phòng
- ✅ Form tạo loại phòng
- ✅ Xóa loại phòng
- ✅ Loading và error states

### 3. Cải Tiến Form Tạo Phòng
- ✅ Dropdown chọn loại phòng (thay vì nhập ID)
- ✅ Tự động tải danh sách loại phòng
- ✅ Fallback nếu không tải được loại phòng
- ✅ Tất cả label bằng tiếng Việt
- ✅ Validation messages bằng tiếng Việt

### 4. Cải Tiến Trang Phòng
- ✅ Tất cả text bằng tiếng Việt
- ✅ Trạng thái phòng hiển thị tiếng Việt:
  - AVAILABLE → Còn trống
  - OCCUPIED → Đang sử dụng
  - MAINTENANCE → Bảo trì
  - RESERVED → Đã đặt
  - UNAVAILABLE → Không khả dụng
- ✅ Định dạng tiền tệ VNĐ
- ✅ Thông báo và nút bấm tiếng Việt

---

## 📁 Files Đã Tạo/Cập Nhật

### Files Mới
1. **frontend/src/api/roomTypeApi.js**
   - API functions cho loại phòng
   - GET, POST, DELETE endpoints

2. **frontend/src/pages/roomTypes/RoomTypesPage.jsx**
   - Trang quản lý loại phòng
   - Bảng hiển thị
   - Form tạo mới
   - Tiếng Việt hoàn toàn

3. **frontend/VIETNAMESE_UPDATE_GUIDE.md**
   - Tài liệu hướng dẫn này

### Files Đã Cập Nhật
4. **frontend/src/components/layout/AdminLayout.jsx**
   - Menu tiếng Việt
   - Thêm menu "Loại Phòng"
   - Nút "Đăng Xuất"

5. **frontend/src/App.jsx**
   - Thêm route /room-types

6. **frontend/src/pages/rooms/RoomsPage.jsx**
   - Hoàn toàn tiếng Việt
   - Dropdown loại phòng
   - Trạng thái tiếng Việt
   - Định dạng VNĐ

---

## 🚀 Cách Sử Dụng

### Bước 1: Khởi Động Backend
```bash
./mvnw spring-boot:run
```

### Bước 2: Khởi Động Frontend
```bash
cd frontend
npm run dev
```

### Bước 3: Truy Cập Hệ Thống
- URL: http://localhost:3000
- Đăng nhập với tài khoản admin

---

## 📋 Quy Trình Sử Dụng

### 1. Tạo Loại Phòng (Bắt Buộc Trước)
1. Đăng nhập vào hệ thống
2. Click menu "Loại Phòng"
3. Click nút "Thêm Loại Phòng"
4. Điền thông tin:
   - **Tên Loại Phòng**: VD: Phòng Deluxe
   - **Mô Tả**: VD: Phòng cao cấp với view biển
5. Click "Tạo Loại Phòng"
6. Loại phòng mới xuất hiện trong bảng

### 2. Tạo Phòng
1. Click menu "Phòng"
2. Click nút "Thêm Phòng"
3. Điền thông tin:
   - **Số Phòng**: VD: 101
   - **Loại Phòng**: Chọn từ dropdown
   - **Trạng Thái**: Chọn trạng thái
   - **Sức Chứa**: VD: 2
   - **Giá Phòng**: VD: 500000
   - **Thư Mục Ảnh**: (Tùy chọn)
   - **Mô Tả**: (Tùy chọn)
4. Click "Tạo Phòng"
5. Phòng mới xuất hiện trong bảng

### 3. Xem Danh Sách Phòng
- Bảng hiển thị tất cả phòng
- Thống kê theo trạng thái
- Tìm kiếm theo số phòng
- Lọc theo trạng thái

### 4. Xóa Phòng/Loại Phòng
- Click nút "Xóa" trên hàng cần xóa
- Xác nhận trong popup
- Dữ liệu được xóa khỏi database

---

## 🎨 Giao Diện Tiếng Việt

### Menu Sidebar
```
📊 Tổng Quan
📋 Loại Phòng
🏨 Phòng
🛎️ Dịch Vụ
📅 Đặt Phòng
🧾 Hóa Đơn
🚪 Đăng Xuất
```

### Trang Loại Phòng
```
┌─────────────────────────────────────────────────┐
│ Loại Phòng                    [Thêm Loại Phòng] │
│ Quản lý các loại phòng trong khách sạn          │
├─────────────────────────────────────────────────┤
│ Tổng Loại Phòng: 3                              │
├─────────────────────────────────────────────────┤
│ ID │ Tên Loại Phòng │ Mô Tả        │ Thao Tác  │
│ 1  │ Phòng Deluxe   │ Phòng cao cấp│ Xem Sửa Xóa│
│ 2  │ Phòng Standard │ Phòng tiêu chuẩn│ Xem Sửa Xóa│
└─────────────────────────────────────────────────┘
```

### Trang Phòng
```
┌─────────────────────────────────────────────────┐
│ Phòng                              [Thêm Phòng] │
│ Quản lý phòng và tình trạng phòng               │
├─────────────────────────────────────────────────┤
│ Tổng: 10 │ Còn trống: 5 │ Đang dùng: 3 │ Bảo trì: 2│
├─────────────────────────────────────────────────┤
│ Số Phòng│Loại│Trạng Thái│Sức Chứa│Giá│Thao Tác │
│ 101     │ 1  │Còn trống │2 người │500k│Xem Sửa Xóa│
│ 102     │ 1  │Đang dùng │2 người │500k│Xem Sửa Xóa│
└─────────────────────────────────────────────────┘
```

### Form Tạo Phòng
```
┌─────────────────────────────────────────────────┐
│ Tạo Phòng Mới                              [X]  │
├─────────────────────────────────────────────────┤
│ Số Phòng *:        [101]                        │
│ Loại Phòng *:      [Phòng Deluxe ▼]            │
│ Trạng Thái *:      [Còn trống ▼]               │
│ Sức Chứa *:        [2]                          │
│ Giá Phòng (VNĐ) *: [500000]                    │
│ Thư Mục Ảnh:       [/images/rooms/101]         │
│ Mô Tả:             [_____________________]      │
│                                                  │
│                           [Hủy] [Tạo Phòng]    │
└─────────────────────────────────────────────────┘
```

---

## 🔄 Trạng Thái Phòng

### Tiếng Anh → Tiếng Việt
```
AVAILABLE    → Còn trống      (Màu xanh lá)
OCCUPIED     → Đang sử dụng   (Màu đỏ)
MAINTENANCE  → Bảo trì         (Màu vàng)
RESERVED     → Đã đặt          (Màu xanh dương)
UNAVAILABLE  → Không khả dụng (Màu xám)
```

---

## 💰 Định Dạng Tiền Tệ

### Hiển Thị VNĐ
```javascript
// Trước
150000 → $150,000

// Sau
150000 → 150.000 đ
500000 → 500.000 đ
```

---

## 📊 API Endpoints

### Loại Phòng
```
GET    /api/v1/room-types          - Lấy tất cả loại phòng
POST   /api/v1/room-types          - Tạo loại phòng mới
DELETE /api/v1/room-types/{id}     - Xóa loại phòng
```

### Phòng
```
GET    /api/v1/rooms               - Lấy tất cả phòng
POST   /api/v1/rooms               - Tạo phòng mới
DELETE /api/v1/rooms/{id}          - Xóa phòng
GET    /api/v1/rooms/search        - Tìm kiếm phòng
GET    /api/v1/rooms/status/{status} - Lọc theo trạng thái
```

---

## ⚠️ Lưu Ý Quan Trọng

### 1. Thứ Tự Tạo Dữ Liệu
```
1. Tạo Loại Phòng trước
2. Sau đó mới tạo Phòng
```

### 2. Nếu Không Tải Được Loại Phòng
- Form sẽ hiển thị input số thay vì dropdown
- Thông báo màu vàng: "Không tải được loại phòng..."
- Có thể nhập ID thủ công
- Nên tạo loại phòng trước để sử dụng dropdown

### 3. Validation
- Tất cả field có dấu * là bắt buộc
- Số phòng phải unique
- Sức chứa tối thiểu 1 người
- Giá phòng tối thiểu 0 VNĐ

---

## 🎯 Tính Năng Đã Hoàn Thành

### Loại Phòng
- ✅ Xem danh sách loại phòng
- ✅ Tạo loại phòng mới
- ✅ Xóa loại phòng
- ✅ Thống kê tổng số
- ✅ Loading state
- ✅ Error handling
- ✅ Empty state

### Phòng
- ✅ Xem danh sách phòng
- ✅ Tạo phòng mới với dropdown loại phòng
- ✅ Xóa phòng
- ✅ Tìm kiếm phòng
- ✅ Lọc theo trạng thái
- ✅ Thống kê theo trạng thái
- ✅ Hiển thị trạng thái tiếng Việt
- ✅ Định dạng tiền VNĐ
- ✅ Loading state
- ✅ Error handling
- ✅ Empty state

---

## 🐛 Xử Lý Lỗi

### Lỗi: "Không thể tải loại phòng"
**Nguyên nhân**: Backend chưa chạy hoặc API không tồn tại

**Giải pháp**:
1. Kiểm tra backend đang chạy
2. Kiểm tra API endpoint /api/v1/room-types
3. Nếu API không có, có thể nhập ID thủ công

### Lỗi: "Số phòng đã tồn tại"
**Nguyên nhân**: Số phòng bị trùng

**Giải pháp**:
1. Sử dụng số phòng khác
2. Kiểm tra danh sách phòng hiện có

### Lỗi: "Loại phòng là bắt buộc"
**Nguyên nhân**: Chưa chọn loại phòng

**Giải pháp**:
1. Chọn loại phòng từ dropdown
2. Hoặc nhập ID nếu dropdown không có

---

## 📚 Tài Liệu Tham Khảo

- **Hướng dẫn đầy đủ**: `ROOMS_MODULE_GUIDE.md`
- **Hướng dẫn nhanh**: `QUICK_START.md`
- **Hướng dẫn admin**: `ADMIN_DASHBOARD_GUIDE.md`

---

## ✅ Checklist Kiểm Tra

### Loại Phòng
- [ ] Có thể xem danh sách loại phòng
- [ ] Có thể tạo loại phòng mới
- [ ] Có thể xóa loại phòng
- [ ] Tất cả text bằng tiếng Việt
- [ ] Loading state hoạt động
- [ ] Error messages bằng tiếng Việt

### Phòng
- [ ] Có thể xem danh sách phòng
- [ ] Có thể tạo phòng mới
- [ ] Dropdown loại phòng hoạt động
- [ ] Có thể xóa phòng
- [ ] Tìm kiếm hoạt động
- [ ] Lọc theo trạng thái hoạt động
- [ ] Trạng thái hiển thị tiếng Việt
- [ ] Giá hiển thị định dạng VNĐ
- [ ] Tất cả text bằng tiếng Việt

### Menu & Navigation
- [ ] Menu sidebar bằng tiếng Việt
- [ ] Có menu "Loại Phòng"
- [ ] Nút "Đăng Xuất" bằng tiếng Việt
- [ ] Tất cả routes hoạt động

---

## 🎉 Hoàn Thành!

Hệ thống quản lý khách sạn đã được:
- ✅ Chuyển đổi hoàn toàn sang tiếng Việt
- ✅ Thêm quản lý Loại Phòng
- ✅ Cải tiến form tạo phòng với dropdown
- ✅ Hiển thị trạng thái tiếng Việt
- ✅ Định dạng tiền tệ VNĐ
- ✅ Phù hợp cho đồ án tốt nghiệp

**Sẵn sàng để demo!** 🚀
