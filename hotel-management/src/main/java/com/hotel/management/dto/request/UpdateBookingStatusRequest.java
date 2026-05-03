package com.hotel.management.dto.request;

import com.hotel.management.enums.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * Request body for PUT /api/v1/bookings/{id}/status
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBookingStatusRequest {

    @NotNull(message = "Status is required")
    private BookingStatus status;
}
