package com.hotel.management.dto;

import com.hotel.management.enums.UserRole;
import com.hotel.management.enums.UserStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Integer id;
    private String username;
    private String password;
    private String fullName;
    private String email;
    private String phone;
    private UserStatus status;
    private UserRole role;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;

    // Optional security question fields (used during creation)
    private String securityQuestion;
    private String securityAnswer; // raw answer — will be hashed before persisting
}
