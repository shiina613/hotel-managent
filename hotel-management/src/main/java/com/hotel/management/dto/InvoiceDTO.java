package com.hotel.management.dto;

import com.hotel.management.enums.InvoiceStatus;
import com.hotel.management.enums.PaymentMethod;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceDTO {

    private Integer id;
    private Integer bookingId;
    private LocalDateTime createAt;
    private Integer roomAmount;
    private Integer serviceAmount;
    private Integer totalPrice;
    private PaymentMethod payMethod;
    private InvoiceStatus status;
    private LocalDateTime paidAt;
    private String note;
    private LocalDateTime updateAt;
}
