package com.hotel.management.dto.request;

import com.hotel.management.enums.InvoiceStatus;
import com.hotel.management.enums.PaymentMethod;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateInvoiceRequest {

    @NotNull(message = "Booking ID is required")
    private Integer bookingId;

    @NotNull(message = "Room amount is required")
    @Min(value = 0, message = "Room amount must be greater than or equal to 0")
    private Integer roomAmount;

    @NotNull(message = "Service amount is required")
    @Min(value = 0, message = "Service amount must be greater than or equal to 0")
    private Integer serviceAmount;

    @NotNull(message = "Total price is required")
    @Min(value = 0, message = "Total price must be greater than or equal to 0")
    private Integer totalPrice;

    @NotNull(message = "Payment method is required")
    private PaymentMethod payMethod;

    @NotNull(message = "Status is required")
    private InvoiceStatus status;

    private String note;
}
