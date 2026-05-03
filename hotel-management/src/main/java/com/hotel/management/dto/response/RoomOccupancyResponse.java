package com.hotel.management.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomOccupancyResponse {

    private Long occupiedRooms;
    private Long totalRooms;
    private Double occupancyRate;
}
