package com.hotel.management.dto.response;

import com.hotel.management.enums.UserRole;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private Integer userId;
    private String username;
    private String fullName;
    private String email;
    private UserRole role;
    private String token;
}
