package com.hotel.management.controller;

import com.hotel.management.dto.ServiceDTO;
import com.hotel.management.dto.request.CreateServiceRequest;
import com.hotel.management.dto.response.ApiResponse;
import com.hotel.management.repository.ServiceRepository;
import com.hotel.management.service.HotelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/services")
@RequiredArgsConstructor
public class ServiceController {

    private final HotelService hotelService;
    private final ServiceRepository serviceRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createService(@Valid @RequestBody CreateServiceRequest request) {
        try {
            if (hotelService.existsByName(request.getName())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Service name already exists"));
            }
            var serviceDTO = ServiceDTO.builder()
                    .name(request.getName())
                    .price(request.getPrice())
                    .unit(request.getUnit())
                    .isActive(request.getIsActive())
                    .build();
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Service created successfully", hotelService.createService(serviceDTO)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to create service: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getServices(
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String unit,
            @RequestParam(required = false) String keyword) {
        try {
            List<ServiceDTO> services;
            if (active != null || unit != null || keyword != null) {
                services = hotelService.filterServices(active, unit, keyword);
            } else {
                services = hotelService.getAllServices();
            }
            return ResponseEntity.ok(ApiResponse.success("Services retrieved successfully", services));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve services: " + e.getMessage()));
        }
    }

    @GetMapping("/units")
    public ResponseEntity<ApiResponse<?>> getUnits() {
        try {
            List<String> units = serviceRepository.findAllUnits();
            return ResponseEntity.ok(ApiResponse.success("Units retrieved successfully", units));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve units: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getServiceById(@PathVariable Integer id) {
        try {
            var service = hotelService.getServiceById(id);
            if (service.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Service not found"));
            return ResponseEntity.ok(ApiResponse.success("Service retrieved successfully", service.get()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve service: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateService(@PathVariable Integer id,
                                                        @Valid @RequestBody CreateServiceRequest request) {
        try {
            var serviceDTO = ServiceDTO.builder()
                    .name(request.getName())
                    .price(request.getPrice())
                    .unit(request.getUnit())
                    .isActive(request.getIsActive())
                    .build();
            return ResponseEntity.ok(ApiResponse.success("Service updated successfully",
                    hotelService.updateService(id, serviceDTO)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update service: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteService(@PathVariable Integer id) {
        try {
            hotelService.deleteService(id);
            return ResponseEntity.ok(ApiResponse.success("Service deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete service: " + e.getMessage()));
        }
    }
}
