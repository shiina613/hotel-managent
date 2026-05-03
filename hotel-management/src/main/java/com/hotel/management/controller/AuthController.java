package com.hotel.management.controller;

import com.hotel.management.dto.request.CreateUserRequest;
import com.hotel.management.dto.request.ForgotPasswordRequest;
import com.hotel.management.dto.request.LoginRequest;
import com.hotel.management.dto.response.ApiResponse;
import com.hotel.management.dto.response.LoginResponse;
import com.hotel.management.security.JwtService;
import com.hotel.management.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "Đăng ký, đăng nhập và quản lý mật khẩu")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    @Operation(
        summary = "Đăng ký tài khoản mới",
        description = "Tạo tài khoản người dùng mới. Mật khẩu được mã hóa BCrypt trước khi lưu."
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Đăng ký thành công"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Username hoặc email đã tồn tại")
    })
    @SecurityRequirements // endpoint công khai, không cần JWT
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(@Valid @RequestBody CreateUserRequest request) {
        try {
            if (userService.existsByUsername(request.getUsername())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Username already exists"));
            }

            if (userService.existsByEmail(request.getEmail())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Email already exists"));
            }

            var userDTO = com.hotel.management.dto.UserDTO.builder()
                    .username(request.getUsername())
                    .password(request.getPassword())
                    .fullName(request.getFullName())
                    .email(request.getEmail())
                    .phone(request.getPhone())
                    .status(request.getStatus())
                    .role(request.getRole())
                    .securityQuestion(request.getSecurityQuestion())
                    .securityAnswer(request.getSecurityAnswer())
                    .build();

            var createdUser = userService.createUser(userDTO);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("User registered successfully", createdUser));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Registration failed: " + e.getMessage()));
        }
    }

    @Operation(
        summary = "Đăng nhập",
        description = "Xác thực tài khoản và trả về JWT token. Token có hiệu lực 24 giờ."
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đăng nhập thành công, trả về JWT token"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Sai tên đăng nhập hoặc mật khẩu"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Tài khoản bị khóa hoặc chưa kích hoạt")
    })
    @SecurityRequirements // endpoint công khai, không cần JWT
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login(@Valid @RequestBody LoginRequest request,
                                                HttpServletRequest httpRequest) {
        try {
            var user = userService.getUserByUsername(request.getUsername());

            if (user.isEmpty()) {
                log.warn("Login failed - username: {}, IP: {}, reason: user not found",
                        request.getUsername(), httpRequest.getRemoteAddr());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Invalid username or password"));
            }

            // Verify password
            if (!userService.verifyPassword(request.getUsername(), request.getPassword())) {
                log.warn("Login failed - username: {}, IP: {}, reason: wrong password",
                        request.getUsername(), httpRequest.getRemoteAddr());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Invalid username or password"));
            }

            // Check account status
            var userStatus = user.get().getStatus();
            if (userStatus != com.hotel.management.enums.UserStatus.ACTIVE) {
                String msg = switch (userStatus) {
                    case SUSPENDED -> "Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.";
                    case INACTIVE   -> "Tài khoản chưa được kích hoạt.";
                    case DELETED    -> "Tài khoản không tồn tại.";
                    default         -> "Tài khoản không hợp lệ.";
                };
                log.warn("Login failed - username: {}, IP: {}, reason: account status {}",
                        request.getUsername(), httpRequest.getRemoteAddr(), userStatus);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error(msg));
            }

            log.info("Login success - username: {}, IP: {}",
                    request.getUsername(), httpRequest.getRemoteAddr());

            var loginResponse = LoginResponse.builder()
                    .userId(user.get().getId())
                    .username(user.get().getUsername())
                    .fullName(user.get().getFullName())
                    .email(user.get().getEmail())
                    .role(user.get().getRole())
                    .token(jwtService.generateToken(
                            user.get().getId().longValue(),
                            user.get().getUsername(),
                            user.get().getRole().name()))
                    .build();

            return ResponseEntity.ok(ApiResponse.success("Login successful", loginResponse));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Login failed: " + e.getMessage()));
        }
    }

    @Operation(
        summary = "Quên mật khẩu",
        description = "Đặt lại mật khẩu bằng câu hỏi bảo mật. Yêu cầu username, câu trả lời bảo mật và mật khẩu mới."
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Đặt lại mật khẩu thành công"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Câu trả lời bảo mật không đúng hoặc người dùng không tồn tại")
    })
    @SecurityRequirements // endpoint công khai, không cần JWT
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<?>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            userService.forgotPassword(request.getUsername(), request.getSecurityAnswer(), request.getNewPassword());
            return ResponseEntity.ok(ApiResponse.success("Mật khẩu đã được đặt lại thành công", null));
        } catch (RuntimeException e) {
            String message = e.getMessage();
            if ("Câu trả lời bảo mật không đúng".equals(message)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Câu trả lời bảo mật không đúng"));
            }
            if ("Người dùng không tồn tại".equals(message)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Người dùng không tồn tại"));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Đặt lại mật khẩu thất bại: " + message));
        }
    }
}
