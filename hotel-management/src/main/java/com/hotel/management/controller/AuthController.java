package com.hotel.management.controller;

import com.hotel.management.dto.request.CreateUserRequest;
import com.hotel.management.dto.request.LoginRequest;
import com.hotel.management.dto.response.ApiResponse;
import com.hotel.management.dto.response.LoginResponse;
import com.hotel.management.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

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
                    .build();

            var createdUser = userService.createUser(userDTO);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("User registered successfully", createdUser));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login(@Valid @RequestBody LoginRequest request) {
        try {
            var user = userService.getUserByUsername(request.getUsername());

            if (user.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Invalid username or password"));
            }

            // Verify password
            if (!userService.verifyPassword(request.getUsername(), request.getPassword())) {
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
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error(msg));
            }
            var loginResponse = LoginResponse.builder()
                    .userId(user.get().getId())
                    .username(user.get().getUsername())
                    .fullName(user.get().getFullName())
                    .email(user.get().getEmail())
                    .role(user.get().getRole())
                    .token("jwt-token-placeholder")
                    .build();

            return ResponseEntity.ok(ApiResponse.success("Login successful", loginResponse));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Login failed: " + e.getMessage()));
        }
    }
}
