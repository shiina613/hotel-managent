package com.hotel.management.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * Request DTO for PUT /api/v1/users/me.
 * Only fullName and phone are allowed to be updated.
 * username, email, and role are intentionally excluded.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    @Pattern(regexp = "^[0-9]{10,11}$", message = "Phone number must contain 10-11 digits")
    private String phone;
}
