package com.hotel.management.controller;

import com.hotel.management.dto.RoomDTO;
import com.hotel.management.dto.request.CreateRoomRequest;
import com.hotel.management.dto.response.ApiResponse;
import com.hotel.management.enums.RoomStatus;
import com.hotel.management.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createRoom(@Valid @RequestBody CreateRoomRequest request) {
        try {
            if (roomService.existsByRoomNumber(request.getRoomNumber())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Room number already exists"));
            }

            var roomDTO = RoomDTO.builder()
                    .roomNumber(request.getRoomNumber())
                    .roomTypeId(request.getRoomTypeId())
                    .status(request.getStatus())
                    .description(request.getDescription())
                    .capacity(request.getCapacity())
                    .imgFolder(request.getImgFolder())
                    .price(request.getPrice())
                    .build();

            var createdRoom = roomService.createRoom(roomDTO);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Room created successfully", createdRoom));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to create room: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getRoomById(@PathVariable Integer id) {
        try {
            var room = roomService.getRoomById(id);

            if (room.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Room not found"));
            }

            return ResponseEntity.ok(ApiResponse.success("Room retrieved successfully", room.get()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve room: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllRooms() {
        try {
            List<RoomDTO> rooms = roomService.getAllRooms();
            return ResponseEntity.ok(ApiResponse.success("Rooms retrieved successfully", rooms));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve rooms: " + e.getMessage()));
        }
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<?>> getAvailableRooms() {
        try {
            List<RoomDTO> rooms = roomService.getAvailableRooms();
            return ResponseEntity.ok(ApiResponse.success("Available rooms retrieved successfully", rooms));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve available rooms: " + e.getMessage()));
        }
    }

    @GetMapping("/available/capacity/{capacity}")
    public ResponseEntity<ApiResponse<?>> getAvailableRoomsByCapacity(@PathVariable Integer capacity) {
        try {
            List<RoomDTO> rooms = roomService.getAvailableRoomsByCapacity(capacity);
            return ResponseEntity.ok(ApiResponse.success("Available rooms retrieved successfully", rooms));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve available rooms: " + e.getMessage()));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<?>> getRoomsByStatus(@PathVariable RoomStatus status) {
        try {
            List<RoomDTO> rooms = roomService.getRoomsByStatus(status);
            return ResponseEntity.ok(ApiResponse.success("Rooms retrieved successfully", rooms));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve rooms: " + e.getMessage()));
        }
    }

    @GetMapping("/type/{roomTypeId}")
    public ResponseEntity<ApiResponse<?>> getRoomsByType(@PathVariable Integer roomTypeId) {
        try {
            List<RoomDTO> rooms = roomService.getRoomsByType(roomTypeId);
            return ResponseEntity.ok(ApiResponse.success("Rooms retrieved successfully", rooms));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve rooms: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<?>> searchRooms(@RequestParam String keyword) {
        try {
            List<RoomDTO> rooms = roomService.searchRooms(keyword);
            return ResponseEntity.ok(ApiResponse.success("Rooms retrieved successfully", rooms));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to search rooms: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateRoom(@PathVariable Integer id, @Valid @RequestBody CreateRoomRequest request) {
        try {
            var roomDTO = RoomDTO.builder()
                    .roomNumber(request.getRoomNumber())
                    .roomTypeId(request.getRoomTypeId())
                    .status(request.getStatus())
                    .description(request.getDescription())
                    .capacity(request.getCapacity())
                    .imgFolder(request.getImgFolder())
                    .price(request.getPrice())
                    .build();

            var updatedRoom = roomService.updateRoom(id, roomDTO);

            return ResponseEntity.ok(ApiResponse.success("Room updated successfully", updatedRoom));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update room: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteRoom(@PathVariable Integer id) {
        try {
            roomService.deleteRoom(id);
            return ResponseEntity.ok(ApiResponse.success("Room deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete room: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/upload-image")
    public ResponseEntity<ApiResponse<?>> uploadRoomImage(
            @PathVariable Integer id,
            @RequestParam("image") MultipartFile file) {
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Please select a file to upload"));
            }

            // Check if room exists
            var roomOptional = roomService.getRoomById(id);
            if (roomOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Room not found"));
            }

            // Create upload directory if not exists
            String uploadDir = "uploads/rooms/" + id;
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : "";
            String filename = UUID.randomUUID().toString() + fileExtension;

            // Save file
            Path filePath = Paths.get(uploadDir, filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Update room with image URL
            String imageUrl = "/uploads/rooms/" + id + "/" + filename;
            var room = roomOptional.get();
            room.setImgFolder(imageUrl);
            
            var roomDTO = RoomDTO.builder()
                    .roomNumber(room.getRoomNumber())
                    .roomTypeId(room.getRoomTypeId())
                    .status(room.getStatus())
                    .description(room.getDescription())
                    .capacity(room.getCapacity())
                    .imgFolder(imageUrl)
                    .price(room.getPrice())
                    .build();
            
            var updatedRoom = roomService.updateRoom(id, roomDTO);

            return ResponseEntity.ok(ApiResponse.success("Image uploaded successfully", updatedRoom));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to upload image: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to upload image: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<ApiResponse<?>> getRoomImage(@PathVariable Integer id) {
        try {
            var room = roomService.getRoomById(id);

            if (room.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Room not found"));
            }

            String imageUrl = room.get().getImgFolder();
            return ResponseEntity.ok(ApiResponse.success("Image URL retrieved successfully", imageUrl));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve image URL: " + e.getMessage()));
        }
    }
}
