package com.hotel.management.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceDTO {

    private Integer id;
    private String name;
    private Integer price;
    private String unit;
    private Boolean isActive;
    private String imageUrl;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
}
