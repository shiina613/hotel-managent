package com.hotel.management.controller;

import com.hotel.management.dto.BookingDTO;
import com.hotel.management.dto.InvoiceDTO;
import com.hotel.management.dto.UserDTO;
import com.hotel.management.dto.request.CreateUserRequest;
import com.hotel.management.dto.request.ResetPasswordRequest;
import com.hotel.management.dto.request.UpdateProfileRequest;
import com.hotel.management.dto.request.UpdateUserRequest;
import com.hotel.management.dto.response.ApiResponse;
import com.hotel.management.dto.response.PageResponse;
import com.hotel.management.enums.UserRole;
import com.hotel.management.enums.UserStatus;
import com.hotel.management.service.BookingService;
import com.hotel.management.service.InvoiceService;
import com.hotel.management.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final BookingService bookingService;
    private final InvoiceService invoiceService;

    // ─────────────────────────────────────────────────────────────────────────
    // Helper: extract username from SecurityContext (set by JwtAuthFilter)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Returns the username of the currently authenticated user from the SecurityContext.
     * JwtAuthFilter sets the principal as the username string.
     */
    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }
        return auth.getName();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // User Profile endpoints (accessible to all authenticated users)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * GET /api/v1/users/me — returns info of the currently logged-in user based on JWT.
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<?>> getCurrentUser() {
        try {
            String username = getCurrentUsername();
            var user = userService.getUserByUsername(username);
            if (user.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found"));
            }
            return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user.get()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve user: " + e.getMessage()));
        }
    }

    /**
     * PUT /api/v1/users/me — update only fullName and phone of the current user.
     * username, email, and role are intentionally ignored.
     */
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<?>> updateCurrentUser(
            @Valid @RequestBody UpdateProfileRequest request) {
        try {
            String username = getCurrentUsername();
            var userOpt = userService.getUserByUsername(username);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found"));
            }
            var updated = userService.updateProfile(userOpt.get().getId(), request.getFullName(), request.getPhone());
            return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update profile: " + e.getMessage()));
        }
    }

    /**
     * GET /api/v1/users/me/bookings — paginated bookings of the current user.
     */
    @GetMapping("/me/bookings")
    public ResponseEntity<ApiResponse<PageResponse<BookingDTO>>> getCurrentUserBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            String username = getCurrentUsername();
            var userOpt = userService.getUserByUsername(username);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found"));
            }
            size = Math.min(size, 100);
            Pageable pageable = PageRequest.of(page, size);
            Integer userId = userOpt.get().getId();
            PageResponse<BookingDTO> result = bookingService.filterBookings(
                    userId, null, null, null, null, pageable);
            return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve bookings: " + e.getMessage()));
        }
    }

    /**
     * GET /api/v1/users/me/invoices — paginated invoices of the current user.
     */
    @GetMapping("/me/invoices")
    public ResponseEntity<ApiResponse<PageResponse<InvoiceDTO>>> getCurrentUserInvoices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            String username = getCurrentUsername();
            var userOpt = userService.getUserByUsername(username);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found"));
            }
            size = Math.min(size, 100);
            Pageable pageable = PageRequest.of(page, size);
            Integer userId = userOpt.get().getId();
            PageResponse<InvoiceDTO> result = invoiceService.filterInvoices(
                    userId, null, null, null, null, null, pageable);
            return ResponseEntity.ok(ApiResponse.success("Invoices retrieved successfully", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve invoices: " + e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Admin-only endpoints
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * PUT /api/v1/users/{id}/reset-password — ADMIN only, encode new password with BCrypt.
     */
    @PutMapping("/{id}/reset-password")
    public ResponseEntity<ApiResponse<?>> resetPassword(
            @PathVariable Integer id,
            @Valid @RequestBody ResetPasswordRequest request) {
        try {
            if (userService.getUserById(id).isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found"));
            }
            userService.resetPassword(id, request.getNewPassword());
            return ResponseEntity.ok(ApiResponse.success("Password reset successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to reset password: " + e.getMessage()));
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Standard CRUD endpoints (ADMIN only — enforced by SecurityConfig)
    // ─────────────────────────────────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createUser(@Valid @RequestBody CreateUserRequest request) {
        try {
            if (userService.existsByUsername(request.getUsername())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Username already exists"));
            }
            if (userService.existsByEmail(request.getEmail())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Email already exists"));
            }
            var userDTO = UserDTO.builder()
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
            var created = userService.createUser(userDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("User created successfully", created));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to create user: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<UserDTO>>> getUsers(
            @RequestParam(required = false) UserRole role,
            @RequestParam(required = false) UserStatus status,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            size = Math.min(size, 100);
            Pageable pageable = PageRequest.of(page, size);
            PageResponse<UserDTO> result;
            if (keyword != null) {
                result = userService.searchUsers(keyword, pageable);
            } else if (role != null) {
                result = userService.getUsersByRole(role, pageable);
            } else if (status != null) {
                result = userService.getUsersByStatus(status, pageable);
            } else {
                result = userService.getAllUsers(pageable);
            }
            return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve users: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getUserById(@PathVariable Integer id) {
        try {
            var user = userService.getUserById(id);
            if (user.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found"));
            }
            return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user.get()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve user: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateUser(@PathVariable Integer id,
                                                     @Valid @RequestBody UpdateUserRequest request) {
        try {
            var existing = userService.getUserById(id);
            if (existing.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found"));
            }

            var byEmail = userService.getUserByEmail(request.getEmail());
            if (byEmail.isPresent() && !byEmail.get().getId().equals(id)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Email already exists"));
            }

            var userDTO = UserDTO.builder()
                    .fullName(request.getFullName())
                    .email(request.getEmail())
                    .phone(request.getPhone())
                    .status(request.getStatus())
                    .role(request.getRole())
                    .build();

            var updated = userService.updateUser(id, userDTO);
            return ResponseEntity.ok(ApiResponse.success("User updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update user: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteUser(@PathVariable Integer id) {
        try {
            if (userService.getUserById(id).isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found"));
            }
            userService.deleteUser(id);
            return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete user: " + e.getMessage()));
        }
    }
}
