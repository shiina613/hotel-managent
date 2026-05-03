package com.hotel.management.dto.response;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopServiceResponse {

    private Integer serviceId;
    private String serviceName;
    private Long totalQuantity;
    private Long totalRevenue;
}
