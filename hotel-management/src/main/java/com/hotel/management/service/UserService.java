package com.hotel.management.service;

import com.hotel.management.dto.UserDTO;
import com.hotel.management.dto.response.PageResponse;
import com.hotel.management.enums.UserRole;
import com.hotel.management.enums.UserStatus;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface UserService {

    UserDTO createUser(UserDTO userDTO);

    UserDTO updateUser(Integer id, UserDTO userDTO);

    void deleteUser(Integer id);

    Optional<UserDTO> getUserById(Integer id);

    Optional<UserDTO> getUserByUsername(String username);

    Optional<UserDTO> getUserByEmail(String email);

    List<UserDTO> getAllUsers();

    List<UserDTO> getUsersByRole(UserRole role);

    List<UserDTO> getUsersByStatus(UserStatus status);

    List<UserDTO> searchUsers(String keyword);

    PageResponse<UserDTO> getAllUsers(Pageable pageable);

    PageResponse<UserDTO> getUsersByRole(UserRole role, Pageable pageable);

    PageResponse<UserDTO> getUsersByStatus(UserStatus status, Pageable pageable);

    PageResponse<UserDTO> searchUsers(String keyword, Pageable pageable);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean verifyPassword(String username, String rawPassword);

    /**
     * Update only the fullName and phone of a user (for self-service profile update).
     *
     * @param id       the user's ID
     * @param fullName new full name (nullable — keeps existing if null)
     * @param phone    new phone number (nullable — keeps existing if null)
     * @return updated UserDTO
     */
    UserDTO updateProfile(Integer id, String fullName, String phone);

    /**
     * Reset a user's password (ADMIN only). Encodes the new password with BCrypt.
     *
     * @param id          the user's ID
     * @param newPassword the plain-text new password to encode and save
     */
    void resetPassword(Integer id, String newPassword);

    /**
     * Reset a user's password via security question (self-service, no auth required).
     * Validates that the user exists, has a securityAnswerHash set, and that the
     * provided answer matches the stored BCrypt hash.
     *
     * @param username       the username of the account to reset
     * @param securityAnswer the plain-text security answer to verify
     * @param newPassword    the new plain-text password to encode and save
     * @throws RuntimeException with message "Người dùng không tồn tại" if user not found
     * @throws RuntimeException with message "Câu trả lời bảo mật không đúng" if answer is wrong or not set
     */
    void forgotPassword(String username, String securityAnswer, String newPassword);
}
