# Thiết Kế Kỹ Thuật — Hotel Management Production-Ready

## 1. Tổng Quan Kiến Trúc

```
[React Frontend :5173]
        │  HTTP + JWT Bearer Token
        ▼
[Spring Boot Backend :8080]
   ├── JwtAuthFilter (OncePerRequestFilter)
   ├── SecurityConfig (Spring Security 6)
   ├── Controllers (7 + DashboardController)
   ├── Services
   └── Repositories (JPA)
        │
        ▼
   [MySQL :3306]
```

**Luồng xác thực:**
1. Client gửi `POST /api/v1/auth/login` → nhận JWT token
2. Mọi request tiếp theo gửi kèm `Authorization: Bearer <token>`
3. `JwtAuthFilter` validate token → set `SecurityContext`
4. Spring Security kiểm tra role trước khi vào Controller

---

## 2. Phase 1 — Bảo Mật

### 2.1 Dependencies cần thêm vào pom.xml

```xml
<!-- Spring Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- JWT (JJWT) -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.6</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>
```

### 2.2 Cấu trúc file mới (Backend)

```
config/
  SecurityConfig.java          ← Spring Security + CORS tích hợp
  JwtAuthFilter.java           ← OncePerRequestFilter validate JWT
security/
  JwtService.java              ← generate/validate/extract JWT
  PasswordMigrationRunner.java ← migrate plain text → BCrypt khi startup
```

### 2.3 JwtService

```java
@Service
public class JwtService {
    // Đọc từ env JWT_SECRET (min 32 chars)
    // generate(userId, username, role) → JWT 24h
    // extractUsername(token) → String
    // extractRole(token) → String
    // isTokenValid(token) → boolean
    // isTokenExpired(token) → boolean
}
```

**Lưu ý lỗi thường gặp:**
- `JWT_SECRET` phải đủ 256 bit (32 chars) cho HMAC-SHA256, nếu ngắn hơn sẽ throw `WeakKeyException`
- Dùng `Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8))` thay vì `Keys.secretKeyFor()`

### 2.4 JwtAuthFilter

```java
@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    // 1. Lấy header Authorization
    // 2. Nếu không có hoặc không bắt đầu "Bearer " → chain.doFilter (để SecurityConfig xử lý)
    // 3. Extract token → validate
    // 4. Nếu valid → set UsernamePasswordAuthenticationToken vào SecurityContext
    // 5. Nếu invalid → response 401 JSON (KHÔNG throw exception để tránh Spring Security redirect)
}
```

**Lưu ý lỗi thường gặp:**
- Filter phải trả về JSON response trực tiếp khi token invalid, KHÔNG để Spring Security redirect về `/login`
- Cần set `response.setContentType("application/json")` trước khi write

### 2.5 SecurityConfig

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        // 1. Disable CSRF (stateless JWT)
        // 2. Tích hợp CORS từ CorsConfig hiện có (dùng cors().configurationSource())
        // 3. SessionManagement: STATELESS
        // 4. Permit: /api/v1/auth/**, /swagger-ui/**, /v3/api-docs/**
        // 5. ADMIN only: /api/v1/dashboard/**, /api/v1/users/**
        // 6. ADMIN + RECEPTIONIST: POST/PUT/DELETE /api/v1/rooms/**, /api/v1/bookings/**
        // 7. Authenticated: tất cả còn lại
        // 8. ExceptionHandling: authenticationEntryPoint trả JSON 401
        // 9. addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
    }
}
```

**Lưu ý lỗi thường gặp:**
- Spring Security 6 dùng lambda DSL, KHÔNG dùng `.and()` deprecated
- CORS phải được cấu hình trong SecurityConfig, KHÔNG chỉ dùng `@CrossOrigin` vì Security filter chạy trước
- `CorsConfig` hiện tại dùng `WebMvcConfigurer` — cần đảm bảo SecurityConfig gọi `cors(c -> c.configurationSource(corsConfigurationSource()))` để tránh CORS bị block trước khi vào controller

### 2.6 PasswordMigrationRunner

```java
@Component
public class PasswordMigrationRunner implements ApplicationRunner {
    // Chạy sau khi app start
    // Query tất cả users WHERE password NOT LIKE '$2a$%'
    // Encode từng password bằng BCrypt strength 12
    // Save lại
    // Log: "Migrated X accounts to BCrypt"
}
```

### 2.7 Environment Variables

**application.properties** (thay thế hardcode):
```properties
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/hotel_management}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:}
jwt.secret=${JWT_SECRET:}
jwt.expiration=${JWT_EXPIRATION:86400000}
```

**File `.env.example`:**
```
DB_URL=jdbc:mysql://localhost:3306/hotel_management
DB_USERNAME=root
DB_PASSWORD=your_password_here
JWT_SECRET=your_32_char_minimum_secret_key_here
JWT_EXPIRATION=86400000
LOG_LEVEL=INFO
```

---

## 3. Phase 2 — Tính Năng

### 3.1 Booking Flow & Conflict Check

**State machine hợp lệ:**
```
PENDING → CONFIRMED (by RECEPTIONIST/ADMIN)
PENDING → CANCELLED (by CUSTOMER/RECEPTIONIST/ADMIN)
CONFIRMED → CHECKED_IN (by RECEPTIONIST/ADMIN)
CONFIRMED → CANCELLED (by CUSTOMER/RECEPTIONIST/ADMIN)
CHECKED_IN → CHECKED_OUT (by RECEPTIONIST/ADMIN)
```

**Conflict check query (JPQL):**
```java
@Query("""
    SELECT COUNT(b) > 0 FROM Booking b
    WHERE b.room.id = :roomId
    AND b.status IN ('CONFIRMED', 'CHECKED_IN')
    AND b.checkInDate < :checkOut
    AND b.checkOutDate > :checkIn
    AND (:excludeId IS NULL OR b.id != :excludeId)
""")
boolean existsConflict(Long roomId, LocalDate checkIn, LocalDate checkOut, Long excludeId);
```

**Lưu ý lỗi thường gặp:**
- Điều kiện overlap: `checkIn < existingCheckOut AND checkOut > existingCheckIn` (không phải `<=`)
- Khi check-out, tự động tạo Invoice: tính `totalAmount = booking.totalPrice + sum(serviceUsage.totalPrice)`

### 3.2 Security Question cho Forgot Password

**Thêm vào entity User:**
```java
@Column(length = 255)
private String securityQuestion;

@Column(length = 255)
private String securityAnswerHash; // BCrypt hash của câu trả lời
```

**Endpoints:**
- `POST /api/v1/auth/forgot-password` — body: `{username, securityAnswer, newPassword}`
- `PUT /api/v1/users/{id}/reset-password` — ADMIN only, body: `{newPassword}`

### 3.3 Pagination

**Thay đổi tất cả service methods:**
```java
// Trước
List<UserDTO> getAllUsers();

// Sau
Page<UserDTO> getAllUsers(Pageable pageable);
```

**Response wrapper:**
```java
public record PageResponse<T>(
    List<T> content,
    int currentPage,
    int pageSize,
    long totalElements,
    int totalPages,
    boolean first,
    boolean last
) {}
```

**Controller pattern:**
```java
@GetMapping
public ResponseEntity<ApiResponse<PageResponse<UserDTO>>> getAll(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size
) {
    size = Math.min(size, 100); // cap at 100
    Pageable pageable = PageRequest.of(page, size);
    ...
}
```

### 3.4 User Profile Endpoints

```
GET  /api/v1/users/me              → thông tin user hiện tại (từ JWT)
PUT  /api/v1/users/me              → cập nhật fullName, phone
GET  /api/v1/users/me/bookings     → bookings của user (paginated)
GET  /api/v1/users/me/invoices     → invoices của user (paginated)
PUT  /api/v1/users/{id}/reset-password → ADMIN reset password
```

---

## 4. Phase 3 — Dashboard

### 4.1 DashboardController & DashboardService

**Endpoints:**
```
GET /api/v1/dashboard/summary          → ADMIN only
GET /api/v1/dashboard/revenue          → ADMIN only
GET /api/v1/dashboard/bookings/stats   → ADMIN only
GET /api/v1/dashboard/rooms/occupancy  → ADMIN only
GET /api/v1/dashboard/services/top     → ADMIN only
```

**Summary response:**
```json
{
  "revenueThisMonth": 15000000,
  "newBookingsToday": 3,
  "occupiedRooms": 12,
  "totalRooms": 20,
  "occupancyRate": 0.6
}
```

**Revenue query (JPQL):**
```java
@Query("""
    SELECT FUNCTION('DATE', i.createdAt) as date, SUM(i.totalAmount) as revenue
    FROM Invoice i
    WHERE i.status = 'PAID'
    AND i.createdAt >= :from
    GROUP BY FUNCTION('DATE', i.createdAt)
    ORDER BY date ASC
""")
List<Object[]> getDailyRevenue(LocalDateTime from);
```

### 4.2 Frontend Dashboard

**Thư viện chart:** `recharts` (đã phổ biến với React, nhẹ hơn Chart.js)

```bash
npm install recharts
```

**Components mới:**
```
pages/DashboardPage.jsx  ← refactor kết nối API thật
components/dashboard/
  SummaryCards.jsx       ← 4 thẻ tổng quan
  RevenueChart.jsx       ← LineChart doanh thu
  BookingStatusChart.jsx ← PieChart trạng thái booking
  OccupancyCard.jsx      ← tỷ lệ lấp đầy
```

**API client mới:**
```
src/api/dashboardApi.js
```

---

## 5. Phase 4 — Chất Lượng

### 5.1 Logging (Logback)

**File:** `src/main/resources/logback-spring.xml`

```xml
<!-- Console + File appender -->
<!-- File: logs/hotel-management.log -->
<!-- Rolling: ngày, giữ 30 ngày -->
<!-- Pattern: timestamp | level | thread | logger | message -->
```

**RequestLoggingFilter:**
```java
@Component
public class RequestLoggingFilter extends OncePerRequestFilter {
    // Log: [METHOD] /path - IP - User - Xms
    // Bỏ qua: /actuator/**, /swagger-ui/**
}
```

### 5.2 Swagger/OpenAPI

**Dependency:**
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.8.8</version>
</dependency>
```

**Config:**
```java
@Bean
public OpenAPI openAPI() {
    return new OpenAPI()
        .info(new Info().title("Hotel Management API").version("1.0"))
        .addSecurityItem(new SecurityRequirement().addList("Bearer Auth"))
        .components(new Components().addSecuritySchemes("Bearer Auth",
            new SecurityScheme().type(HTTP).scheme("bearer").bearerFormat("JWT")));
}
```

**application.properties:**
```properties
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.api-docs.path=/v3/api-docs
# Cho phép không cần auth
springdoc.swagger-ui.disable-swagger-default-url=true
```

### 5.3 Frontend — Pagination Component

```jsx
// components/ui/Pagination.jsx
// Props: currentPage, totalPages, totalElements, pageSize, onPageChange
// Hiển thị: "Hiển thị X-Y trong tổng số Z bản ghi"
// Nút: Trước | 1 2 3 ... | Sau
```

### 5.4 Frontend — Error Boundary

```jsx
// components/ui/ErrorBoundary.jsx
class ErrorBoundary extends React.Component {
  // componentDidCatch → log error
  // render fallback UI với nút "Tải lại trang"
}
```

### 5.5 Frontend — Loading Skeleton

```jsx
// components/ui/TableSkeleton.jsx  ← cho các trang danh sách
// components/ui/CardSkeleton.jsx   ← cho Dashboard cards
```

---

## 6. Thứ Tự Triển Khai & Rủi Ro

### Thứ tự bắt buộc (dependency chain):

```
1. BCrypt + PasswordMigrationRunner
2. JwtService
3. JwtAuthFilter
4. SecurityConfig (tích hợp CORS)
5. Cập nhật AuthController dùng JWT thật
6. Env variables
   ↓
7. Pagination (backend)
8. Booking flow + conflict check
9. User profile endpoints
10. Forgot password
    ↓
11. Dashboard API
12. Dashboard Frontend
    ↓
13. Logging
14. Swagger
15. Pagination Frontend
16. Error Boundary + Loading states
17. Validation đầy đủ
```

### Rủi ro và cách xử lý:

| Rủi ro | Nguyên nhân | Cách xử lý |
|--------|-------------|------------|
| CORS bị block sau khi thêm Security | Spring Security filter chạy trước CORS | Cấu hình CORS trong SecurityConfig, không chỉ WebMvcConfigurer |
| JWT WeakKeyException | Secret key < 32 chars | Validate độ dài key khi startup, throw rõ ràng |
| Migration runner chạy lại nhiều lần | App restart | Check `$2a$` prefix trước khi encode |
| Double-booking race condition | 2 request đồng thời | Dùng `@Transactional` + pessimistic lock hoặc unique constraint |
| Spring Security redirect về /login | Filter không trả JSON | Override `AuthenticationEntryPoint` trả JSON 401 |
| Swagger bị chặn bởi Security | Endpoint không được permit | Permit `/swagger-ui/**`, `/v3/api-docs/**` trong SecurityConfig |
| Frontend token hết hạn | 24h expiry | axiosClient đã có 401 handler → redirect login |
| `Page` serialization lỗi | Spring Data Page không serialize đẹp | Dùng `PageResponse` wrapper tự định nghĩa |
