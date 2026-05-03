package com.hotel.management.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {

    private Long revenueThisMonth;
    private Long newBookingsToday;
    private Long occupiedRooms;
    private Long totalRooms;
    private Double occupancyRate;
}
