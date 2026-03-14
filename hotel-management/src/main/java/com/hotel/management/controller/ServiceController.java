package com.hotel.management.controller;

import com.hotel.management.dto.ServiceDTO;
import com.hotel.management.dto.request.CreateServiceRequest;
import com.hotel.management.dto.response.ApiResponse;
import com.hotel.management.enums.ServiceUnit;
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

            var createdService = hotelService.createService(serviceDTO);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Service created successfully", createdService));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to create service: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getServiceById(@PathVariable Integer id) {
        try {
            var service = hotelService.getServiceById(id);

            if (service.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Service not found"));
            }

            return ResponseEntity.ok(ApiResponse.success("Service retrieved successfully", service.get()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve service: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllServices() {
        try {
            List<ServiceDTO> services = hotelService.getAllServices();
            return ResponseEntity.ok(ApiResponse.success("Services retrieved successfully", services));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve services: " + e.getMessage()));
        }
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<?>> getActiveServices() {
        try {
            List<ServiceDTO> services = hotelService.getActiveServices();
            return ResponseEntity.ok(ApiResponse.success("Active services retrieved successfully", services));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve active services: " + e.getMessage()));
        }
    }

    @GetMapping("/unit/{unit}")
    public ResponseEntity<ApiResponse<?>> getServicesByUnit(@PathVariable ServiceUnit unit) {
        try {
            List<ServiceDTO> services = hotelService.getServicesByUnit(unit);
            return ResponseEntity.ok(ApiResponse.success("Services retrieved successfully", services));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve services: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<?>> searchServices(@RequestParam String keyword) {
        try {
            List<ServiceDTO> services = hotelService.searchServices(keyword);
            return ResponseEntity.ok(ApiResponse.success("Services retrieved successfully", services));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to search services: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateService(@PathVariable Integer id, @Valid @RequestBody CreateServiceRequest request) {
        try {
            var serviceDTO = ServiceDTO.builder()
                    .name(request.getName())
                    .price(request.getPrice())
                    .unit(request.getUnit())
                    .isActive(request.getIsActive())
                    .build();

            var updatedService = hotelService.updateService(id, serviceDTO);

            return ResponseEntity.ok(ApiResponse.success("Service updated successfully", updatedService));
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
