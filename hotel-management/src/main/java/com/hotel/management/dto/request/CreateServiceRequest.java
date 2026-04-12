package com.hotel.management.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateServiceRequest {

    @NotBlank(message = "Service name is required")
    @Size(min = 2, max = 100)
    private String name;

    @NotNull(message = "Price is required")
    @Min(value = 0)
    private Integer price;

    @NotBlank(message = "Unit is required")
    @Size(max = 50)
    private String unit;

    @NotNull(message = "Active status is required")
    private Boolean isActive;
}
