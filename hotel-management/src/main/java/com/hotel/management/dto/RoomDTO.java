package com.hotel.management.dto;

import com.hotel.management.enums.RoomStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomDTO {

    private Integer id;
    private String roomNumber;
    private Integer roomTypeId;
    private String roomTypeName;
    private RoomStatus status;
    private String description;
    private Integer capacity;
    private String imgFolder;
    private Integer price;
    private Integer hourlyPrice;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
}
