package com.hotel.management.controller;

import com.hotel.management.dto.ServiceDTO;
import com.hotel.management.dto.request.CreateServiceRequest;
import com.hotel.management.dto.response.ApiResponse;
import com.hotel.management.dto.response.PageResponse;
import com.hotel.management.repository.ServiceRepository;
import com.hotel.management.service.HotelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

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
                    .imageUrl(request.getImageUrl())
                    .build();
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Service created successfully", hotelService.createService(serviceDTO)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to create service: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ServiceDTO>>> getServices(
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String unit,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            size = Math.min(size, 100);
            Pageable pageable = PageRequest.of(page, size);
            PageResponse<ServiceDTO> result;
            if (active != null || unit != null || keyword != null) {
                result = hotelService.filterServices(active, unit, keyword, pageable);
            } else {
                result = hotelService.getAllServices(pageable);
            }
            return ResponseEntity.ok(ApiResponse.success("Services retrieved successfully", result));
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
                    .imageUrl(request.getImageUrl())
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

    @PostMapping("/{id}/upload-image")
    public ResponseEntity<ApiResponse<?>> uploadServiceImage(
            @PathVariable Integer id,
            @RequestParam("image") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Please select a file to upload"));
            }
            var serviceOpt = hotelService.getServiceById(id);
            if (serviceOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Service not found"));
            }

            String uploadDir = System.getProperty("user.dir") + "/uploads/services/" + id;
            new File(uploadDir).mkdirs();

            String originalFilename = file.getOriginalFilename();
            String ext = (originalFilename != null && originalFilename.contains("."))
                    ? originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
            String filename = UUID.randomUUID() + ext;

            Path filePath = Paths.get(uploadDir, filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String imageUrl = "/uploads/services/" + id + "/" + filename;

            var existing = serviceOpt.get();
            var serviceDTO = ServiceDTO.builder()
                    .name(existing.getName())
                    .price(existing.getPrice())
                    .unit(existing.getUnit())
                    .isActive(existing.getIsActive())
                    .imageUrl(imageUrl)
                    .build();
            var updated = hotelService.updateService(id, serviceDTO);
            return ResponseEntity.ok(ApiResponse.success("Image uploaded successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to upload image: " + e.getMessage()));
        }
    }
}
