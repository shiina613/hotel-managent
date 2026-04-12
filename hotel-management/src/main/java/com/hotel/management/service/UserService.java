package com.hotel.management.service;

import com.hotel.management.dto.UserDTO;
import com.hotel.management.enums.UserRole;
import com.hotel.management.enums.UserStatus;

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

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean verifyPassword(String username, String rawPassword);
}
