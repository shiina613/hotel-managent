package com.hotel.management.dto.request;

import com.hotel.management.enums.BookingStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingRequest {

    @NotNull(message = "User ID is required")
    private Integer userId;

    @NotNull(message = "Room ID is required")
    private Integer roomId;

    @NotNull(message = "Check-in date is required")
    private LocalDateTime checkInAt;

    @NotNull(message = "Check-out date is required")
    private LocalDateTime checkOutAt;

    @NotNull(message = "Room price is required")
    @Min(value = 0, message = "Room price must be greater than or equal to 0")
    private Integer roomPrice;

    @NotNull(message = "Total price is required")
    @Min(value = 0, message = "Total price must be greater than or equal to 0")
    private Integer totalPrice;

    @NotNull(message = "Status is required")
    private BookingStatus status;

    private String note;
}
