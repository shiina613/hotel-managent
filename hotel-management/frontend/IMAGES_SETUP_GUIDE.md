# Hướng Dẫn Thêm Ảnh Vào Homepage Demo

## 📁 Cấu Trúc Thư Mục

Tôi đã tạo thư mục `src/assets/images/` để lưu trữ tất cả ảnh. Dưới đây là cấu trúc:

```
hotel-management/frontend/src/assets/images/
├── banner/
│   └── hero-banner.jpg          (Ảnh banner chính)
├── rooms/
│   ├── deluxe-room.jpg          (Ảnh phòng Deluxe)
│   ├── superior-room.jpg        (Ảnh phòng Superior)
│   └── family-room.jpg          (Ảnh phòng Family)
└── services/
    ├── spa.jpg                  (Ảnh dịch vụ Spa)
    ├── pool.jpg                 (Ảnh hồ bơi)
    ├── restaurant.jpg           (Ảnh nhà hàng)
    └── airport-transfer.jpg     (Ảnh đưa đón sân bay)
```

## 🖼️ Danh Sách Ảnh Cần Thêm

### 1. Banner (1 ảnh)
- **Tên file**: `hero-banner.jpg`
- **Đường dẫn**: `src/assets/images/banner/hero-banner.jpg`
- **Kích thước khuyến nghị**: 1920x600px (tỷ lệ 16:9)
- **Mô tả**: Ảnh banner chính của khách sạn, hiển thị ở phần đầu trang

### 2. Phòng (3 ảnh)
- **Phòng Deluxe**
  - Tên file: `deluxe-room.jpg`
  - Đường dẫn: `src/assets/images/rooms/deluxe-room.jpg`
  - Kích thước: 600x400px (tỷ lệ 3:2)

- **Phòng Superior**
  - Tên file: `superior-room.jpg`
  - Đường dẫn: `src/assets/images/rooms/superior-room.jpg`
  - Kích thước: 600x400px (tỷ lệ 3:2)

- **Phòng Family**
  - Tên file: `family-room.jpg`
  - Đường dẫn: `src/assets/images/rooms/family-room.jpg`
  - Kích thước: 600x400px (tỷ lệ 3:2)

### 3. Dịch Vụ (4 ảnh)
- **Spa & Wellness**
  - Tên file: `spa.jpg`
  - Đường dẫn: `src/assets/images/services/spa.jpg`
  - Kích thước: 400x300px (tỷ lệ 4:3)

- **Hồ Bơi**
  - Tên file: `pool.jpg`
  - Đường dẫn: `src/assets/images/services/pool.jpg`
  - Kích thước: 400x300px (tỷ lệ 4:3)

- **Nhà Hàng**
  - Tên file: `restaurant.jpg`
  - Đường dẫn: `src/assets/images/services/restaurant.jpg`
  - Kích thước: 400x300px (tỷ lệ 4:3)

- **Đưa Đón Sân Bay**
  - Tên file: `airport-transfer.jpg`
  - Đường dẫn: `src/assets/images/services/airport-transfer.jpg`
  - Kích thước: 400x300px (tỷ lệ 4:3)

## 📝 Hướng Dẫn Từng Bước

### Bước 1: Chuẩn Bị Ảnh
1. Tìm hoặc tải ảnh từ các trang như:
   - Unsplash (unsplash.com)
   - Pexels (pexels.com)
   - Pixabay (pixabay.com)
   - Hoặc sử dụng ảnh của riêng bạn

2. Nén ảnh để tối ưu hóa (tùy chọn):
   - Sử dụng TinyPNG (tinypng.com)
   - Hoặc ImageOptim (imageoptim.com)
   - Kích thước file nên < 500KB mỗi ảnh

### Bước 2: Tạo Thư Mục
Tạo các thư mục sau trong `src/assets/images/`:
```
mkdir -p src/assets/images/banner
mkdir -p src/assets/images/rooms
mkdir -p src/assets/images/services
```

### Bước 3: Đặt Ảnh Vào Thư Mục
1. Đặt `hero-banner.jpg` vào `src/assets/images/banner/`
2. Đặt 3 ảnh phòng vào `src/assets/images/rooms/`
3. Đặt 4 ảnh dịch vụ vào `src/assets/images/services/`

### Bước 4: Kiểm Tra
- Mở trang Homepage
- Nếu ảnh không hiển thị, sẽ có placeholder với hướng dẫn
- Kiểm tra console (F12) để xem lỗi

## 🔍 Cách Kiểm Tra Ảnh

### Nếu ảnh không hiển thị:
1. Kiểm tra đường dẫn file có đúng không
2. Kiểm tra tên file có khớp không (phân biệt chữ hoa/thường)
3. Kiểm tra file có tồn tại không
4. Mở DevTools (F12) → Console để xem lỗi

### Nếu ảnh hiển thị nhưng bị cắt:
1. Điều chỉnh kích thước ảnh
2. Sử dụng tỷ lệ khuyến nghị
3. Ảnh sẽ tự động fit vào container

## 💡 Mẹo Tối Ưu Hóa

### Chất Lượng Ảnh
- Sử dụng ảnh có độ phân giải cao (ít nhất 1200px chiều rộng)
- Đảm bảo ảnh rõ nét và chuyên nghiệp
- Tránh ảnh mờ hoặc bị cắt

### Tốc Độ Tải
- Nén ảnh trước khi upload
- Sử dụng format WebP nếu có thể (tương thích tốt hơn)
- Kích thước file < 500KB mỗi ảnh

### Tính Nhất Quán
- Sử dụng ảnh có phong cách giống nhau
- Đảm bảo màu sắc hài hòa
- Tỷ lệ ảnh phải đúng theo khuyến nghị

## 🎨 Gợi Ý Nguồn Ảnh

### Ảnh Khách Sạn
- Unsplash: Tìm "luxury hotel", "hotel room", "spa"
- Pexels: Tìm "hotel", "resort", "bedroom"
- Pixabay: Tìm "hotel interior", "swimming pool"

### Ảnh Dịch Vụ
- Spa: Tìm "spa", "massage", "wellness"
- Hồ bơi: Tìm "swimming pool", "resort pool"
- Nhà hàng: Tìm "restaurant", "dining", "food"
- Sân bay: Tìm "airport", "car", "transfer"

## ⚠️ Lưu Ý Quan Trọng

1. **Tên file phải chính xác** - Phải khớp với tên trong code
2. **Đường dẫn phải đúng** - Phải nằm trong thư mục `src/assets/images/`
3. **Format ảnh** - Nên dùng JPG hoặc PNG
4. **Kích thước** - Tuân theo khuyến nghị để hiển thị tốt
5. **Bản quyền** - Sử dụng ảnh có quyền sử dụng miễn phí

## 🔧 Nếu Cần Thay Đổi Đường Dẫn

Nếu bạn muốn thay đổi đường dẫn ảnh, hãy chỉnh sửa trong `HomePage.jsx`:

```javascript
// Tìm phần mockRooms
const mockRooms = [
  {
    id: 1,
    name: 'Phòng Deluxe',
    // ...
    image: '/src/assets/images/rooms/deluxe-room.jpg'  // ← Thay đổi đây
  },
  // ...
];

// Tìm phần mockServices
const mockServices = [
  {
    id: 1,
    name: 'Spa & Wellness',
    // ...
    image: '/src/assets/images/services/spa.jpg'  // ← Thay đổi đây
  },
  // ...
];
```

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra console (F12) để xem lỗi
2. Kiểm tra đường dẫn file
3. Kiểm tra tên file có khớp không
4. Thử làm mới trang (Ctrl+F5)

---

**Chúc bạn thêm ảnh thành công! 🎉**
