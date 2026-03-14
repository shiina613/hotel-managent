package com.hotel.management.dto;

import com.hotel.management.enums.BookingStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {

    private Integer id;
    private Integer userId;
    private String userName;
    private Integer roomId;
    private String roomNumber;
    private LocalDateTime createAt;
    private LocalDateTime checkInAt;
    private LocalDateTime checkOutAt;
    private Integer roomPrice;
    private Integer totalPrice;
    private BookingStatus status;
    private String note;
    private LocalDateTime updateAt;
}
