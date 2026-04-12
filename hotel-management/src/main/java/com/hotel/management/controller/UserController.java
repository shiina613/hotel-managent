package com.hotel.management.controller;

import com.hotel.management.dto.UserDTO;
import com.hotel.management.dto.request.CreateUserRequest;
import com.hotel.management.dto.request.UpdateUserRequest;
import com.hotel.management.dto.response.ApiResponse;
import com.hotel.management.enums.UserRole;
import com.hotel.management.enums.UserStatus;
import com.hotel.management.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

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
    public ResponseEntity<ApiResponse<?>> getUsers(
            @RequestParam(required = false) UserRole role,
            @RequestParam(required = false) UserStatus status,
            @RequestParam(required = false) String keyword) {
        try {
            List<UserDTO> users;
            if (keyword != null) {
                users = userService.searchUsers(keyword);
            } else if (role != null && status != null) {
                users = userService.getUsersByRole(role).stream()
                        .filter(u -> u.getStatus() == status)
                        .toList();
            } else if (role != null) {
                users = userService.getUsersByRole(role);
            } else if (status != null) {
                users = userService.getUsersByStatus(status);
            } else {
                users = userService.getAllUsers();
            }
            return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve users: " + e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<?>> getCurrentUser(@RequestParam String username) {
        try {
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

            // Check email conflict with another user
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
