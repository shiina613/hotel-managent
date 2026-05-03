# Tài Liệu Yêu Cầu — Hotel Management Production-Ready

## Giới Thiệu

Hệ thống Hotel Management hiện tại đã có nền tảng cơ bản (Spring Boot 3.5.11 + React 19 + MySQL) với 7 entities, 7 controllers và 14 trang frontend. Tuy nhiên hệ thống chưa sẵn sàng cho môi trường production do các vấn đề bảo mật nghiêm trọng (mật khẩu plain text, JWT giả), thiếu tính năng quan trọng (booking flow chưa hoàn chỉnh, không có phân trang), dashboard chưa kết nối dữ liệu thật, và chất lượng code chưa đạt chuẩn (thiếu logging, thiếu Swagger, thiếu error handling).

Mục tiêu: Đưa hệ thống lên trạng thái production-ready chạy ổn định trên local, phục vụ 3 role: Admin, Receptionist, Customer.

---

## Bảng Thuật Ngữ

- **Hệ_Thống**: Ứng dụng Hotel Management (Spring Boot backend + React frontend)
- **Auth_Service**: Module xử lý xác thực và phân quyền
- **JWT_Filter**: Spring Security filter kiểm tra JWT token trên mỗi request
- **Booking_Service**: Module xử lý đặt phòng
- **Invoice_Service**: Module xử lý hóa đơn
- **Dashboard_Service**: Module cung cấp dữ liệu thống kê
- **Admin**: Người dùng có role ADMIN — quản lý toàn bộ hệ thống
- **Receptionist**: Người dùng có role RECEPTIONIST — xử lý booking, check-in/out
- **Customer**: Người dùng có role CUSTOMER — đặt phòng, xem hóa đơn
- **Booking**: Bản ghi đặt phòng với các trạng thái: PENDING → CONFIRMED → CHECKED_IN → CHECKED_OUT / CANCELLED
- **Invoice**: Hóa đơn thanh toán gắn với một Booking
- **BCrypt**: Thuật toán mã hóa mật khẩu một chiều
- **JWT**: JSON Web Token dùng để xác thực stateless
- **Conflict_Check**: Kiểm tra xung đột lịch đặt phòng (double-booking)
- **Pagination**: Phân trang kết quả trả về từ API
- **Migration_Runner**: Component chạy khi khởi động để migrate dữ liệu cũ

---

## Yêu Cầu

---

### Yêu Cầu 1: Mã Hóa Mật Khẩu BCrypt

**User Story:** Là một Admin, tôi muốn mật khẩu người dùng được mã hóa bằng BCrypt, để bảo vệ thông tin đăng nhập khi database bị lộ.

#### Tiêu Chí Chấp Nhận

1. THE Auth_Service SHALL mã hóa mật khẩu bằng BCrypt với strength 12 trước khi lưu vào database.
2. WHEN người dùng đăng nhập, THE Auth_Service SHALL so sánh mật khẩu nhập vào với hash BCrypt trong database bằng `BCryptPasswordEncoder.matches()`.
3. IF mật khẩu nhập vào không khớp với hash BCrypt, THEN THE Auth_Service SHALL trả về HTTP 401 với thông báo "Tên đăng nhập hoặc mật khẩu không đúng".
4. THE Migration_Runner SHALL tự động phát hiện các tài khoản có mật khẩu plain text (không bắt đầu bằng `$2a$`) khi ứng dụng khởi động và mã hóa lại bằng BCrypt.
5. WHEN Migration_Runner hoàn thành, THE Hệ_Thống SHALL ghi log số lượng tài khoản đã được migrate.

---

### Yêu Cầu 2: JWT Xác Thực Thật

**User Story:** Là một Admin, tôi muốn hệ thống sử dụng JWT thật để xác thực, để mỗi request được kiểm tra danh tính một cách an toàn.

#### Tiêu Chí Chấp Nhận

1. WHEN người dùng đăng nhập thành công, THE Auth_Service SHALL tạo JWT token chứa `userId`, `username`, `role` và thời hạn 24 giờ, ký bằng HMAC-SHA256 với secret key từ biến môi trường.
2. THE JWT_Filter SHALL kiểm tra JWT token trên mọi request đến các endpoint được bảo vệ trước khi request được xử lý.
3. IF JWT token không hợp lệ hoặc đã hết hạn, THEN THE JWT_Filter SHALL trả về HTTP 401 với thông báo "Token không hợp lệ hoặc đã hết hạn".
4. IF header `Authorization` không có hoặc không bắt đầu bằng `Bearer `, THEN THE JWT_Filter SHALL trả về HTTP 401 với thông báo "Yêu cầu xác thực".
5. THE Hệ_Thống SHALL đọc JWT secret key từ biến môi trường `JWT_SECRET` (tối thiểu 32 ký tự).
6. IF biến môi trường `JWT_SECRET` không được cấu hình, THEN THE Hệ_Thống SHALL từ chối khởi động và ghi log lỗi rõ ràng.

---

### Yêu Cầu 3: Phân Quyền Theo Role

**User Story:** Là một Admin, tôi muốn mỗi endpoint chỉ cho phép role phù hợp truy cập, để ngăn chặn truy cập trái phép.

#### Tiêu Chí Chấp Nhận

1. THE JWT_Filter SHALL trích xuất role từ JWT token và đặt vào Spring Security context trên mỗi request hợp lệ.
2. WHEN Customer gọi endpoint quản lý user (`/api/v1/users/**`), THE Hệ_Thống SHALL trả về HTTP 403.
3. WHEN Customer gọi endpoint quản lý phòng (`POST/PUT/DELETE /api/v1/rooms/**`), THE Hệ_Thống SHALL trả về HTTP 403.
4. WHEN Receptionist gọi endpoint thống kê dashboard (`/api/v1/dashboard/**`), THE Hệ_Thống SHALL trả về HTTP 403.
5. THE Hệ_Thống SHALL cho phép các endpoint `/api/v1/auth/login` và `/api/v1/auth/register` truy cập không cần xác thực.
6. THE Hệ_Thống SHALL cấu hình Spring Security tương thích với CORS config hiện tại (không xung đột).

---

### Yêu Cầu 4: Credentials Qua Biến Môi Trường

**User Story:** Là một Admin, tôi muốn thông tin nhạy cảm không được hardcode trong source code, để bảo mật khi chia sẻ code.

#### Tiêu Chí Chấp Nhận

1. THE Hệ_Thống SHALL đọc thông tin kết nối database (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`) từ biến môi trường hoặc file `.env` không được commit vào git.
2. THE Hệ_Thống SHALL cung cấp file `.env.example` với tên các biến môi trường cần thiết và giá trị mẫu (không chứa giá trị thật).
3. THE Hệ_Thống SHALL thêm `.env` vào `.gitignore` để tránh commit thông tin nhạy cảm.
4. IF biến môi trường bắt buộc không được cấu hình khi khởi động, THEN THE Hệ_Thống SHALL ghi log cảnh báo rõ ràng tên biến còn thiếu.

---

### Yêu Cầu 5: Booking Flow Hoàn Chỉnh

**User Story:** Là một Customer, tôi muốn đặt phòng và theo dõi trạng thái booking, để biết khi nào booking được xác nhận.

#### Tiêu Chí Chấp Nhận

1. WHEN Customer tạo booking mới, THE Booking_Service SHALL đặt trạng thái ban đầu là `PENDING`.
2. WHEN Customer tạo booking, THE Booking_Service SHALL kiểm tra xung đột lịch: nếu phòng đã có booking với trạng thái `CONFIRMED` hoặc `CHECKED_IN` trong khoảng thời gian yêu cầu, THE Booking_Service SHALL trả về HTTP 409 với thông báo "Phòng đã được đặt trong khoảng thời gian này".
3. WHEN Receptionist hoặc Admin xác nhận booking `PENDING`, THE Booking_Service SHALL chuyển trạng thái sang `CONFIRMED`.
4. WHEN Receptionist hoặc Admin thực hiện check-in cho booking `CONFIRMED`, THE Booking_Service SHALL chuyển trạng thái sang `CHECKED_IN`.
5. WHEN Receptionist hoặc Admin thực hiện check-out cho booking `CHECKED_IN`, THE Booking_Service SHALL chuyển trạng thái sang `CHECKED_OUT` và tự động tạo Invoice với trạng thái `UNPAID`.
6. IF Receptionist hoặc Admin cố gắng chuyển trạng thái không hợp lệ (ví dụ: từ `PENDING` sang `CHECKED_OUT`), THEN THE Booking_Service SHALL trả về HTTP 400 với thông báo mô tả chuyển đổi không hợp lệ.

---

### Yêu Cầu 6: Hủy Booking Có Điều Kiện

**User Story:** Là một Customer, tôi muốn hủy booking khi chưa check-in, để không bị ràng buộc khi kế hoạch thay đổi.

#### Tiêu Chí Chấp Nhận

1. WHEN Customer hủy booking của chính mình có trạng thái `PENDING`, THE Booking_Service SHALL chuyển trạng thái sang `CANCELLED`.
2. WHEN Customer hủy booking của chính mình có trạng thái `CONFIRMED`, THE Booking_Service SHALL chuyển trạng thái sang `CANCELLED`.
3. IF Customer cố gắng hủy booking có trạng thái `CHECKED_IN` hoặc `CHECKED_OUT`, THEN THE Booking_Service SHALL trả về HTTP 400 với thông báo "Không thể hủy booking đã check-in hoặc đã hoàn thành".
4. IF Customer cố gắng hủy booking của người dùng khác, THEN THE Booking_Service SHALL trả về HTTP 403.
5. WHEN Receptionist hoặc Admin hủy bất kỳ booking nào có trạng thái `PENDING` hoặc `CONFIRMED`, THE Booking_Service SHALL chuyển trạng thái sang `CANCELLED`.

---

### Yêu Cầu 7: Reset Mật Khẩu Không Cần Email

**User Story:** Là một Customer, tôi muốn có thể lấy lại mật khẩu khi quên, để không bị mất tài khoản.

#### Tiêu Chí Chấp Nhận

1. THE Auth_Service SHALL hỗ trợ Admin reset mật khẩu cho bất kỳ tài khoản nào thông qua endpoint `PUT /api/v1/users/{id}/reset-password`.
2. WHEN Admin reset mật khẩu, THE Auth_Service SHALL đặt mật khẩu mới được cung cấp, mã hóa bằng BCrypt trước khi lưu.
3. THE Auth_Service SHALL hỗ trợ Customer tự reset mật khẩu bằng câu hỏi bảo mật thông qua endpoint `POST /api/v1/auth/forgot-password`.
4. WHEN Customer đăng ký, THE Auth_Service SHALL cho phép Customer thiết lập câu hỏi bảo mật và câu trả lời (lưu dưới dạng hash).
5. WHEN Customer gửi yêu cầu forgot-password với câu trả lời đúng, THE Auth_Service SHALL cho phép đặt mật khẩu mới.
6. IF câu trả lời bảo mật sai, THEN THE Auth_Service SHALL trả về HTTP 400 với thông báo "Câu trả lời bảo mật không đúng".

---

### Yêu Cầu 8: Phân Trang Tất Cả List API

**User Story:** Là một Admin, tôi muốn các API trả về danh sách có phân trang, để hệ thống hoạt động ổn định khi dữ liệu lớn.

#### Tiêu Chí Chấp Nhận

1. THE Hệ_Thống SHALL hỗ trợ tham số `page` (bắt đầu từ 0) và `size` (mặc định 10, tối đa 100) trên tất cả các endpoint trả về danh sách.
2. WHEN client gọi list API với tham số phân trang, THE Hệ_Thống SHALL trả về response chứa: `content` (danh sách), `totalElements`, `totalPages`, `currentPage`, `pageSize`.
3. IF tham số `size` vượt quá 100, THEN THE Hệ_Thống SHALL tự động giới hạn về 100.
4. THE Hệ_Thống SHALL áp dụng phân trang cho các endpoint: `/api/v1/users`, `/api/v1/rooms`, `/api/v1/bookings`, `/api/v1/invoices`, `/api/v1/services`, `/api/v1/room-types`.

---

### Yêu Cầu 9: Hồ Sơ Người Dùng

**User Story:** Là một Customer, tôi muốn xem và cập nhật thông tin cá nhân của mình, để giữ thông tin liên lạc chính xác.

#### Tiêu Chí Chấp Nhận

1. THE Hệ_Thống SHALL cung cấp endpoint `GET /api/v1/users/me` trả về thông tin của người dùng đang đăng nhập dựa trên JWT token.
2. THE Hệ_Thống SHALL cung cấp endpoint `PUT /api/v1/users/me` cho phép người dùng cập nhật `fullName`, `phone` của chính mình.
3. IF người dùng cố gắng cập nhật `username`, `email`, hoặc `role` qua endpoint `/api/v1/users/me`, THEN THE Hệ_Thống SHALL bỏ qua các trường đó và chỉ cập nhật các trường được phép.
4. THE Hệ_Thống SHALL cung cấp endpoint `GET /api/v1/users/me/invoices` trả về danh sách hóa đơn của người dùng đang đăng nhập (có phân trang).
5. THE Hệ_Thống SHALL cung cấp endpoint `GET /api/v1/users/me/bookings` trả về danh sách booking của người dùng đang đăng nhập (có phân trang).

---

### Yêu Cầu 10: API Thống Kê Dashboard

**User Story:** Là một Admin, tôi muốn xem số liệu thống kê thật từ database, để đưa ra quyết định kinh doanh dựa trên dữ liệu.

#### Tiêu Chí Chấp Nhận

1. THE Dashboard_Service SHALL cung cấp endpoint `GET /api/v1/dashboard/revenue` trả về doanh thu theo ngày trong 30 ngày gần nhất và theo tháng trong 12 tháng gần nhất, tính từ các Invoice có trạng thái `PAID`.
2. THE Dashboard_Service SHALL cung cấp endpoint `GET /api/v1/dashboard/bookings/stats` trả về số lượng booking theo từng trạng thái (`PENDING`, `CONFIRMED`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`) trong khoảng thời gian được chỉ định.
3. THE Dashboard_Service SHALL cung cấp endpoint `GET /api/v1/dashboard/rooms/occupancy` trả về tỷ lệ lấp đầy phòng (số phòng đang `CHECKED_IN` / tổng số phòng `AVAILABLE`).
4. THE Dashboard_Service SHALL cung cấp endpoint `GET /api/v1/dashboard/services/top` trả về top 5 dịch vụ được sử dụng nhiều nhất theo số lượng và doanh thu.
5. THE Dashboard_Service SHALL cung cấp endpoint `GET /api/v1/dashboard/summary` trả về tổng quan: tổng doanh thu tháng hiện tại, số booking mới hôm nay, số phòng đang có khách, số khách đang ở.
6. WHEN Admin gọi các endpoint dashboard, THE Hệ_Thống SHALL trả về dữ liệu trong vòng 2 giây.

---

### Yêu Cầu 11: Frontend Dashboard Kết Nối Dữ Liệu Thật

**User Story:** Là một Admin, tôi muốn Dashboard hiển thị biểu đồ từ dữ liệu thật, để theo dõi hoạt động kinh doanh trực quan.

#### Tiêu Chí Chấp Nhận

1. THE Hệ_Thống SHALL hiển thị biểu đồ doanh thu theo ngày/tháng trên trang Dashboard của Admin, lấy dữ liệu từ API `/api/v1/dashboard/revenue`.
2. THE Hệ_Thống SHALL hiển thị biểu đồ tròn phân bổ trạng thái booking trên Dashboard, lấy dữ liệu từ API `/api/v1/dashboard/bookings/stats`.
3. THE Hệ_Thống SHALL hiển thị các thẻ tổng quan (summary cards) với số liệu thật từ API `/api/v1/dashboard/summary`.
4. WHEN dữ liệu dashboard đang tải, THE Hệ_Thống SHALL hiển thị skeleton loading UI thay vì màn hình trắng.
5. IF API dashboard trả về lỗi, THEN THE Hệ_Thống SHALL hiển thị thông báo lỗi thân thiện và nút "Thử lại".

---

### Yêu Cầu 12: Logging Hệ Thống

**User Story:** Là một Admin, tôi muốn hệ thống ghi log đầy đủ, để dễ dàng debug khi có sự cố.

#### Tiêu Chí Chấp Nhận

1. THE Hệ_Thống SHALL ghi log mỗi HTTP request với thông tin: method, URL, IP client, user đang đăng nhập (nếu có), thời gian xử lý (ms).
2. THE Hệ_Thống SHALL ghi log mỗi HTTP response với thông tin: status code, thời gian xử lý.
3. THE Hệ_Thống SHALL ghi log tất cả exception với stack trace đầy đủ ở mức ERROR.
4. THE Hệ_Thống SHALL ghi log các sự kiện bảo mật quan trọng: đăng nhập thành công, đăng nhập thất bại, JWT không hợp lệ, truy cập bị từ chối (403).
5. THE Hệ_Thống SHALL sử dụng SLF4J với Logback, cấu hình log level qua biến môi trường `LOG_LEVEL` (mặc định `INFO`).
6. THE Hệ_Thống SHALL ghi log ra file `logs/hotel-management.log` với rotation theo ngày, giữ tối đa 30 ngày.

---

### Yêu Cầu 13: Tài Liệu API Swagger/OpenAPI

**User Story:** Là một Developer, tôi muốn có tài liệu API tự động, để dễ dàng test và tích hợp.

#### Tiêu Chí Chấp Nhận

1. THE Hệ_Thống SHALL tích hợp SpringDoc OpenAPI 3 và cung cấp Swagger UI tại đường dẫn `/swagger-ui.html`.
2. THE Hệ_Thống SHALL mô tả tất cả 7 controller với đầy đủ endpoint, request/response schema, và HTTP status codes.
3. THE Hệ_Thống SHALL hỗ trợ xác thực JWT trực tiếp trên Swagger UI thông qua nút "Authorize".
4. WHEN developer truy cập `/swagger-ui.html`, THE Hệ_Thống SHALL hiển thị tài liệu API mà không yêu cầu xác thực.

---

### Yêu Cầu 14: Phân Trang Frontend

**User Story:** Là một Admin, tôi muốn các trang danh sách có phân trang, để dễ dàng duyệt qua nhiều bản ghi.

#### Tiêu Chí Chấp Nhận

1. THE Hệ_Thống SHALL hiển thị component phân trang trên tất cả các trang danh sách (Users, Rooms, Bookings, Invoices, Services, RoomTypes).
2. WHEN người dùng chuyển trang, THE Hệ_Thống SHALL gọi API với tham số `page` và `size` tương ứng và cập nhật danh sách.
3. THE Hệ_Thống SHALL hiển thị thông tin "Hiển thị X-Y trong tổng số Z bản ghi" trên mỗi trang danh sách.
4. WHEN danh sách đang tải, THE Hệ_Thống SHALL hiển thị skeleton loading thay vì màn hình trắng.

---

### Yêu Cầu 15: Error Boundary và Xử Lý Lỗi Frontend

**User Story:** Là một Customer, tôi muốn ứng dụng không bị crash hoàn toàn khi có lỗi, để vẫn có thể tiếp tục sử dụng các phần khác.

#### Tiêu Chí Chấp Nhận

1. THE Hệ_Thống SHALL bọc mỗi trang chính bằng React Error Boundary component để bắt lỗi render.
2. IF một trang gặp lỗi render, THEN THE Hệ_Thống SHALL hiển thị trang lỗi thân thiện với nút "Tải lại trang" thay vì màn hình trắng.
3. THE Hệ_Thống SHALL hiển thị loading spinner hoặc skeleton UI trong khi chờ API response trên tất cả các trang.
4. IF API call thất bại, THEN THE Hệ_Thống SHALL hiển thị thông báo lỗi cụ thể (không phải "undefined" hay object) thông qua Toast notification.
5. THE Hệ_Thống SHALL vô hiệu hóa nút submit trong form khi đang xử lý request để tránh double-submit.

---

### Yêu Cầu 16: Validation Đầu Vào Đầy Đủ

**User Story:** Là một Customer, tôi muốn nhận thông báo lỗi rõ ràng khi nhập sai dữ liệu, để biết cần sửa gì.

#### Tiêu Chí Chấp Nhận

1. THE Hệ_Thống SHALL validate tất cả input trên backend bằng Jakarta Validation annotations và trả về danh sách lỗi cụ thể theo từng trường khi có vi phạm.
2. IF request body thiếu trường bắt buộc hoặc sai định dạng, THEN THE Hệ_Thống SHALL trả về HTTP 400 với danh sách lỗi theo format `{"field": "tên_trường", "message": "mô tả lỗi"}`.
3. THE Hệ_Thống SHALL validate ngày check-in phải trước ngày check-out khi tạo booking.
4. IF ngày check-in trong quá khứ khi tạo booking mới, THEN THE Booking_Service SHALL trả về HTTP 400 với thông báo "Ngày check-in không thể là ngày trong quá khứ".
5. THE Hệ_Thống SHALL validate frontend: hiển thị lỗi inline dưới từng trường input ngay khi người dùng rời khỏi trường đó (on blur).
6. THE Hệ_Thống SHALL validate email đúng định dạng, số điện thoại chỉ chứa số và có 10-11 chữ số, mật khẩu tối thiểu 8 ký tự.
