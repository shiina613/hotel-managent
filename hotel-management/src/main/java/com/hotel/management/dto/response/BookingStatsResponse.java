package com.hotel.management.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingStatsResponse {

    private Long pending;
    private Long confirmed;
    private Long checkedIn;
    private Long checkedOut;
    private Long cancelled;
    private Long total;
}
