package com.hotel.management.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueResponse {

    private List<DailyRevenueResponse> daily;
    private List<MonthlyRevenueResponse> monthly;
}
