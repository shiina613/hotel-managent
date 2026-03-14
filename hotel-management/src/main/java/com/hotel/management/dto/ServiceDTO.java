package com.hotel.management.dto;

import com.hotel.management.enums.ServiceUnit;
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
    private ServiceUnit unit;
    private Boolean isActive;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
}
