# Danh Sách Task — Hotel Management Production-Ready

## Phase 1: Bảo Mật

- [x] 1. Thêm dependencies Spring Security và JJWT vào pom.xml
  - [x] 1.1 Thêm `spring-boot-starter-security`
  - [x] 1.2 Thêm `jjwt-api`, `jjwt-impl`, `jjwt-jackson` version 0.12.6
  - [x] 1.3 Thêm `springdoc-openapi-starter-webmvc-ui` version 2.8.8
  - [x] 1.4 Verify build thành công sau khi thêm dependencies

- [x] 2. Implement BCrypt password hashing
  - [x] 2.1 Tạo `BCryptPasswordEncoder` bean trong một `@Configuration` class
  - [x] 2.2 Cập nhật `UserServiceImpl.createUser()` để encode password trước khi save
  - [x] 2.3 Cập nhật `UserServiceImpl.verifyPassword()` dùng `BCryptPasswordEncoder.matches()`
  - [x] 2.4 Tạo `PasswordMigrationRunner implements ApplicationRunner` — detect plain text passwords (không bắt đầu `$2a$`) và encode lại
  - [x] 2.5 Thêm log trong MigrationRunner: "Migrated X accounts to BCrypt"

- [x] 3. Implement JwtService
  - [x] 3.1 Tạo `security/JwtService.java` với các method: `generateToken(userId, username, role)`, `extractUsername(token)`, `extractRole(token)`, `extractUserId(token)`, `isTokenValid(token)`, `isTokenExpired(token)`
  - [x] 3.2 Đọc `jwt.secret` từ `@Value("${jwt.secret}")` — validate độ dài >= 32 chars trong `@PostConstruct`, throw `IllegalStateException` nếu thiếu
  - [x] 3.3 Đọc `jwt.expiration` từ properties (default 86400000ms = 24h)
  - [x] 3.4 Dùng `Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8))` để tạo signing key

- [x] 4. Implement JwtAuthFilter
  - [x] 4.1 Tạo `config/JwtAuthFilter.java extends OncePerRequestFilter`
  - [x] 4.2 Extract Bearer token từ `Authorization` header
  - [x] 4.3 Nếu token valid: tạo `UsernamePasswordAuthenticationToken` với role, set vào `SecurityContextHolder`
  - [x] 4.4 Nếu token invalid/expired: ghi response JSON `{"success":false,"message":"Token không hợp lệ hoặc đã hết hạn"}` với status 401 — KHÔNG throw exception
  - [x] 4.5 Nếu không có header Authorization: gọi `chain.doFilter()` để SecurityConfig xử lý

- [x] 5. Implement SecurityConfig
  - [x] 5.1 Tạo `config/SecurityConfig.java` với `@EnableWebSecurity`
  - [x] 5.2 Disable CSRF (stateless)
  - [x] 5.3 Cấu hình CORS trong SecurityConfig bằng `CorsConfigurationSource` bean — đồng bộ với `CorsConfig.java` hiện có (origins: localhost:3000, localhost:5173)
  - [x] 5.4 SessionManagement: STATELESS
  - [x] 5.5 Permit all: `/api/v1/auth/**`, `/swagger-ui/**`, `/swagger-ui.html`, `/v3/api-docs/**`
  - [x] 5.6 ADMIN only: `/api/v1/dashboard/**`, `GET /api/v1/users/**`, `POST /api/v1/users/**`, `PUT /api/v1/users/**`, `DELETE /api/v1/users/**`
  - [x] 5.7 ADMIN + RECEPTIONIST: `POST/PUT/DELETE /api/v1/rooms/**`, `PUT /api/v1/bookings/**`
  - [x] 5.8 Authenticated (any role): tất cả còn lại
  - [x] 5.9 Override `AuthenticationEntryPoint` trả JSON 401 thay vì redirect `/login`
  - [x] 5.10 Override `AccessDeniedHandler` trả JSON 403
  - [x] 5.11 Thêm `JwtAuthFilter` trước `UsernamePasswordAuthenticationFilter`

- [x] 6. Cập nhật AuthController dùng JWT thật
  - [x] 6.1 Inject `JwtService` vào `AuthController`
  - [x] 6.2 Thay `"jwt-token-placeholder"` bằng `jwtService.generateToken(userId, username, role)`
  - [x] 6.3 Cập nhật `UserServiceImpl.createUser()` để encode password (nếu chưa làm ở task 2.2)

- [x] 7. Cấu hình Environment Variables
  - [x] 7.1 Cập nhật `application.properties` dùng `${DB_URL:...}`, `${DB_USERNAME:...}`, `${DB_PASSWORD:}`, `${JWT_SECRET:}`, `${JWT_EXPIRATION:86400000}`
  - [x] 7.2 Tạo file `.env.example` với tất cả biến môi trường cần thiết
  - [x] 7.3 Kiểm tra `.gitignore` đã có `.env` chưa, nếu chưa thêm vào
  - [x] 7.4 Tạo file `.env` local với giá trị thật (không commit)

- [x] 8. Thêm security question vào User entity
  - [x] 8.1 Thêm field `securityQuestion` (String, nullable) vào `User` entity
  - [x] 8.2 Thêm field `securityAnswerHash` (String, nullable) vào `User` entity
  - [x] 8.3 Cập nhật `CreateUserRequest` thêm optional fields `securityQuestion`, `securityAnswer`
  - [x] 8.4 Cập nhật `UserServiceImpl.createUser()` encode `securityAnswer` bằng BCrypt trước khi lưu

---

## Phase 2: Tính Năng

- [x] 9. Implement Pagination cho tất cả List API (Backend)
  - [x] 9.1 Tạo `PageResponse<T>` record/class trong package `dto/response`
  - [x] 9.2 Cập nhật `UserService` + `UserServiceImpl`: `getAllUsers(Pageable)`, `getUsersByRole(role, Pageable)`, `getUsersByStatus(status, Pageable)`, `searchUsers(keyword, Pageable)`
  - [x] 9.3 Cập nhật `RoomService` + impl tương tự
  - [x] 9.4 Cập nhật `BookingService` + impl tương tự
  - [x] 9.5 Cập nhật `InvoiceService` + impl tương tự
  - [x] 9.6 Cập nhật `ServiceService` + impl tương tự
  - [x] 9.7 Cập nhật `RoomTypeService` + impl tương tự
  - [x] 9.8 Cập nhật tất cả Controller tương ứng: nhận `page`, `size` params, cap size tại 100, trả `PageResponse`

- [x] 10. Implement Booking Flow hoàn chỉnh
  - [x] 10.1 Thêm query `existsConflict(roomId, checkIn, checkOut, excludeId)` vào `BookingRepository` — điều kiện overlap: `checkIn < existingCheckOut AND checkOut > existingCheckIn`
  - [x] 10.2 Cập nhật `BookingService.createBooking()`: set status = PENDING, gọi conflict check, throw `BusinessException` (HTTP 409) nếu có conflict
  - [x] 10.3 Validate `checkInDate < checkOutDate` và `checkInDate >= today` trong `BookingService.createBooking()`
  - [x] 10.4 Tạo method `BookingService.updateStatus(bookingId, newStatus, currentUser)` với state machine validation
  - [x] 10.5 State machine: chỉ cho phép các transition hợp lệ, throw `BadRequestException` nếu invalid
  - [x] 10.6 Khi transition sang `CHECKED_OUT`: tự động tạo Invoice với `totalAmount = booking.totalPrice + sum(serviceUsage.totalPrice)`, status = PENDING (chưa thanh toán)
  - [x] 10.7 Thêm endpoint `PUT /api/v1/bookings/{id}/status` nhận `{status}` trong body
  - [x] 10.8 Đảm bảo `@Transactional` trên `updateStatus` để tránh race condition

- [x] 11. Implement Hủy Booking có điều kiện
  - [x] 11.1 Thêm endpoint `PUT /api/v1/bookings/{id}/cancel`
  - [x] 11.2 Nếu Customer: kiểm tra booking thuộc về user hiện tại (từ JWT), throw 403 nếu không phải
  - [x] 11.3 Chỉ cho phép hủy khi status = PENDING hoặc CONFIRMED, throw 400 nếu CHECKED_IN/CHECKED_OUT
  - [x] 11.4 Receptionist/Admin có thể hủy bất kỳ booking PENDING/CONFIRMED nào

- [x] 12. Implement User Profile endpoints
  - [x] 12.1 Tạo helper method `getCurrentUserId()` trong base controller hoặc utility class — extract userId từ `SecurityContextHolder`
  - [x] 12.2 Thêm endpoint `GET /api/v1/users/me` — trả thông tin user hiện tại
  - [x] 12.3 Thêm endpoint `PUT /api/v1/users/me` — chỉ cho phép cập nhật `fullName`, `phone`; bỏ qua các trường khác
  - [x] 12.4 Thêm endpoint `GET /api/v1/users/me/bookings` — bookings của user hiện tại (paginated)
  - [x] 12.5 Thêm endpoint `GET /api/v1/users/me/invoices` — invoices của user hiện tại qua bookings (paginated)
  - [x] 12.6 Thêm endpoint `PUT /api/v1/users/{id}/reset-password` — ADMIN only, encode password mới bằng BCrypt

- [x] 13. Implement Forgot Password
  - [x] 13.1 Thêm endpoint `POST /api/v1/auth/forgot-password` — body: `{username, securityAnswer, newPassword}`
  - [x] 13.2 Validate: user tồn tại, `securityAnswerHash` không null, BCrypt.matches(answer, hash)
  - [x] 13.3 Nếu đúng: encode newPassword bằng BCrypt, save
  - [x] 13.4 Nếu sai: trả HTTP 400 "Câu trả lời bảo mật không đúng"
  - [x] 13.5 Cập nhật `ForgotPasswordPage.jsx` frontend gọi API thật

---

## Phase 3: Dashboard

- [x] 14. Implement Dashboard API (Backend)
  - [x] 14.1 Tạo `DashboardController.java` với `@RequestMapping("/api/v1/dashboard")`, ADMIN only
  - [x] 14.2 Tạo `DashboardService.java` interface + `DashboardServiceImpl.java`
  - [x] 14.3 Implement `GET /api/v1/dashboard/summary` — trả: revenueThisMonth, newBookingsToday, occupiedRooms, totalRooms, occupancyRate
  - [x] 14.4 Implement `GET /api/v1/dashboard/revenue` — daily revenue 30 ngày gần nhất + monthly revenue 12 tháng gần nhất, từ Invoice status=PAID
  - [x] 14.5 Implement `GET /api/v1/dashboard/bookings/stats` — count theo từng BookingStatus
  - [x] 14.6 Implement `GET /api/v1/dashboard/rooms/occupancy` — số phòng CHECKED_IN / tổng phòng
  - [x] 14.7 Implement `GET /api/v1/dashboard/services/top` — top 5 dịch vụ theo quantity và revenue
  - [x] 14.8 Thêm JPQL queries vào `InvoiceRepository`, `BookingRepository`, `ServiceUsageRepository`

- [x] 15. Implement Dashboard Frontend
  - [x] 15.1 Cài `recharts`: `npm install recharts` trong thư mục frontend
  - [x] 15.2 Tạo `src/api/dashboardApi.js` với các method gọi 5 endpoints dashboard
  - [x] 15.3 Tạo `components/dashboard/SummaryCards.jsx` — 4 thẻ: doanh thu tháng, booking hôm nay, phòng đang có khách, tỷ lệ lấp đầy
  - [x] 15.4 Tạo `components/dashboard/RevenueChart.jsx` — LineChart doanh thu theo ngày/tháng dùng recharts
  - [x] 15.5 Tạo `components/dashboard/BookingStatusChart.jsx` — PieChart trạng thái booking dùng recharts
  - [x] 15.6 Refactor `DashboardPage.jsx` — gọi API thật, hiển thị skeleton khi loading, hiển thị lỗi + nút "Thử lại" khi API fail

---

## Phase 4: Chất Lượng

- [x] 16. Implement Logging
  - [x] 16.1 Tạo `src/main/resources/logback-spring.xml` — console appender + file appender (`logs/hotel-management.log`), rolling policy theo ngày, giữ 30 ngày
  - [x] 16.2 Cấu hình log level từ env `${LOG_LEVEL:INFO}`
  - [x] 16.3 Tạo `RequestLoggingFilter extends OncePerRequestFilter` — log: method, URL, IP, username (từ SecurityContext), thời gian xử lý
  - [x] 16.4 Thêm `@Slf4j` và log các sự kiện bảo mật trong `AuthController`: login success, login failed
  - [x] 16.5 Log JWT invalid/expired trong `JwtAuthFilter`
  - [x] 16.6 Log 403 trong `AccessDeniedHandler`

- [x] 17. Cấu hình Swagger/OpenAPI
  - [x] 17.1 Tạo `config/OpenApiConfig.java` — cấu hình title, version, Bearer Auth security scheme
  - [x] 17.2 Thêm vào `application.properties`: `springdoc.swagger-ui.path=/swagger-ui.html`, `springdoc.api-docs.path=/v3/api-docs`
  - [x] 17.3 Đảm bảo SecurityConfig permit `/swagger-ui/**` và `/v3/api-docs/**` (đã làm ở task 5.5)
  - [x] 17.4 Thêm `@Operation`, `@ApiResponse` annotations vào các Controller chính (Auth, Booking, Invoice)

- [x] 18. Implement Pagination Frontend
  - [x] 18.1 Tạo `components/ui/Pagination.jsx` — props: currentPage, totalPages, totalElements, pageSize, onPageChange
  - [x] 18.2 Hiển thị "Hiển thị X-Y trong tổng số Z bản ghi"
  - [x] 18.3 Tích hợp Pagination vào: UsersPage, RoomsPage, BookingsPage, InvoicesPage, ServicesPage, RoomTypesPage
  - [x] 18.4 Cập nhật các API call trong frontend thêm `page` và `size` params

- [x] 19. Implement Loading Skeleton
  - [x] 19.1 Tạo `components/ui/TableSkeleton.jsx` — skeleton rows cho bảng danh sách
  - [x] 19.2 Tạo `components/ui/CardSkeleton.jsx` — skeleton cho Dashboard cards
  - [x] 19.3 Tích hợp skeleton vào tất cả trang danh sách và Dashboard

- [x] 20. Implement Error Boundary
  - [x] 20.1 Tạo `components/ui/ErrorBoundary.jsx` — class component với `componentDidCatch`, hiển thị fallback UI với nút "Tải lại trang"
  - [x] 20.2 Bọc tất cả Route trong `App.jsx` bằng `ErrorBoundary`
  - [x] 20.3 Cập nhật `axiosClient.js` — đảm bảo error message luôn là string (không phải object/undefined)
  - [x] 20.4 Disable submit button khi form đang loading (thêm `disabled={isLoading}` vào tất cả form submit buttons)

- [x] 21. Hoàn thiện Validation
  - [x] 21.1 Kiểm tra tất cả `@RequestBody` trong controllers đã có `@Valid` annotation
  - [x] 21.2 Thêm validation annotations vào các DTO còn thiếu: `@Email`, `@Pattern` cho phone, `@Size(min=8)` cho password
  - [x] 21.3 Thêm custom validator cho booking dates: `checkInDate < checkOutDate`
  - [x] 21.4 Frontend: thêm inline validation (on blur) cho các form chính: Login, Register, Booking
  - [x] 21.5 Frontend: hiển thị lỗi từ API response theo từng field (dùng `fieldErrors` từ `ValidationErrorResponse`)
