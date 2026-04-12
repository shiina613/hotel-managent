package com.hotel.management.controller;

import com.hotel.management.dto.RoomTypeDTO;
import com.hotel.management.dto.request.CreateRoomTypeRequest;
import com.hotel.management.dto.request.UpdateRoomTypeRequest;
import com.hotel.management.dto.response.ApiResponse;
import com.hotel.management.exception.ResourceNotFoundException;
import com.hotel.management.service.RoomTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/room-types")
@RequiredArgsConstructor
public class RoomTypeController {

    private final RoomTypeService roomTypeService;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createRoomType(@Valid @RequestBody CreateRoomTypeRequest request) {
        try {
            if (roomTypeService.existsByName(request.getName())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Room type name already exists"));
            }

            var roomTypeDTO = RoomTypeDTO.builder()
                    .name(request.getName())
                    .description(request.getDescription())
                    .build();

            var createdRoomType = roomTypeService.createRoomType(roomTypeDTO);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Room type created successfully", createdRoomType));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to create room type: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getRoomTypes(@RequestParam(required = false) String keyword) {
        try {
            List<RoomTypeDTO> roomTypes = keyword != null
                    ? roomTypeService.searchRoomTypes(keyword)
                    : roomTypeService.getAllRoomTypes();
            return ResponseEntity.ok(ApiResponse.success("Room types retrieved successfully", roomTypes));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve room types: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getRoomTypeById(@PathVariable Integer id) {
        try {
            var roomType = roomTypeService.getRoomTypeById(id);

            if (roomType.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Room type not found"));
            }

            return ResponseEntity.ok(ApiResponse.success("Room type retrieved successfully", roomType.get()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve room type: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateRoomType(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateRoomTypeRequest request) {
        try {
            if (!roomTypeService.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Room type not found"));
            }

            var existingRoomType = roomTypeService.getRoomTypeByName(request.getName());
            if (existingRoomType.isPresent() && !existingRoomType.get().getId().equals(id)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Room type name already exists"));
            }

            var roomTypeDTO = RoomTypeDTO.builder()
                    .name(request.getName())
                    .description(request.getDescription())
                    .build();

            var updatedRoomType = roomTypeService.updateRoomType(id, roomTypeDTO);

            return ResponseEntity.ok(ApiResponse.success("Room type updated successfully", updatedRoomType));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update room type: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteRoomType(@PathVariable Integer id) {
        try {
            if (!roomTypeService.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Room type not found"));
            }

            roomTypeService.deleteRoomType(id);
            return ResponseEntity.ok(ApiResponse.success("Room type deleted successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete room type: " + e.getMessage()));
        }
    }
}
