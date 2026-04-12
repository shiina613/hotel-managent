package com.hotel.management.dto.request;

import com.hotel.management.enums.RoomStatus;
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
public class CreateRoomRequest {

    @NotBlank(message = "Room number is required")
    @Size(max = 50, message = "Room number must not exceed 50 characters")
    private String roomNumber;

    @NotNull(message = "Room type ID is required")
    private Integer roomTypeId;

    @NotNull(message = "Status is required")
    private RoomStatus status;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @Size(max = 2000, message = "Image folder must not exceed 2000 characters")
    private String imgFolder;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be greater than or equal to 0")
    private Integer price;

    @Min(value = 0, message = "Hourly price must be greater than or equal to 0")
    private Integer hourlyPrice;
}
