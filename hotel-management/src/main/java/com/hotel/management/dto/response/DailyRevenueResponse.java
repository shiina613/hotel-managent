package com.hotel.management.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyRevenueResponse {

    private String date;
    private Long revenue;
}
