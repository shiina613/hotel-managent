package com.hotel.management.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotel.management.dto.RoomDTO;
import com.hotel.management.dto.request.CreateRoomRequest;
import com.hotel.management.dto.response.ApiResponse;
import com.hotel.management.dto.response.PageResponse;
import com.hotel.management.enums.RoomStatus;
import com.hotel.management.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;
    private final ObjectMapper objectMapper;

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
                    .hourlyPrice(request.getHourlyPrice())
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
    public ResponseEntity<ApiResponse<PageResponse<RoomDTO>>> getRooms(
            @RequestParam(required = false) RoomStatus status,
            @RequestParam(required = false) Integer type,
            @RequestParam(required = false) Boolean available,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            size = Math.min(size, 100);
            Pageable pageable = PageRequest.of(page, size);
            PageResponse<RoomDTO> result;
            if (Boolean.TRUE.equals(available) && capacity != null) {
                List<RoomDTO> rooms = roomService.getAvailableRoomsByCapacity(capacity);
                result = new PageResponse<>(rooms, 0, rooms.size(), rooms.size(), 1, true, true);
            } else if (Boolean.TRUE.equals(available) && status == null && type == null && keyword == null) {
                List<RoomDTO> rooms = roomService.getAvailableRooms();
                result = new PageResponse<>(rooms, 0, rooms.size(), rooms.size(), 1, true, true);
            } else if (status != null || type != null || keyword != null) {
                result = roomService.filterRooms(status, type, keyword, pageable);
            } else {
                result = roomService.getAllRooms(pageable);
            }
            return ResponseEntity.ok(ApiResponse.success("Rooms retrieved successfully", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve rooms: " + e.getMessage()));
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
                    .hourlyPrice(request.getHourlyPrice())
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
            @RequestParam("image") MultipartFile file,
            @RequestParam(value = "isThumb", defaultValue = "false") boolean isThumb) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Please select a file to upload"));
            }
            var roomOptional = roomService.getRoomById(id);
            if (roomOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Room not found"));
            }

            String uploadDir = System.getProperty("user.dir") + "/uploads/rooms/" + id;
            new File(uploadDir).mkdirs();

            String originalFilename = file.getOriginalFilename();
            String ext = (originalFilename != null && originalFilename.contains("."))
                    ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String filename = UUID.randomUUID() + ext;

            Path filePath = Paths.get(uploadDir, filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String imageUrl = "/uploads/rooms/" + id + "/" + filename;
            var room = roomOptional.get();

            String existing = room.getImgFolder();
            List<String> images;
            try {
                if (existing != null && existing.startsWith("[")) {
                    images = objectMapper.readValue(existing, new TypeReference<List<String>>(){});
                } else {
                    images = new ArrayList<>();
                    if (existing != null && !existing.isBlank()) images.add(existing);
                }
            } catch (Exception ex) {
                images = new ArrayList<>();
            }

            if (isThumb) {
                images.removeIf(u -> u.startsWith("thumb:"));
                images.add(0, "thumb:" + imageUrl);
            } else {
                images.add(imageUrl);
            }

            String newImgFolder = objectMapper.writeValueAsString(images);
            var roomDTO = RoomDTO.builder()
                    .roomNumber(room.getRoomNumber()).roomTypeId(room.getRoomTypeId())
                    .status(room.getStatus()).description(room.getDescription())
                    .capacity(room.getCapacity()).imgFolder(newImgFolder).price(room.getPrice())
                    .hourlyPrice(room.getHourlyPrice())
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

    @DeleteMapping("/{id}/images")
    public ResponseEntity<ApiResponse<?>> deleteRoomImage(
            @PathVariable Integer id,
            @RequestParam String imageUrl) {
        try {
            var roomOptional = roomService.getRoomById(id);
            if (roomOptional.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Room not found"));
            var room = roomOptional.get();
            List<String> images;
            try {
                String existing = room.getImgFolder();
                images = (existing != null && existing.startsWith("["))
                    ? objectMapper.readValue(existing, new TypeReference<List<String>>(){})
                    : new ArrayList<>();
            } catch (Exception ex) { images = new ArrayList<>(); }
            images.removeIf(u -> u.equals(imageUrl) || u.equals("thumb:" + imageUrl));
            var roomDTO = RoomDTO.builder()
                    .roomNumber(room.getRoomNumber()).roomTypeId(room.getRoomTypeId())
                    .status(room.getStatus()).description(room.getDescription())
                    .capacity(room.getCapacity()).imgFolder(objectMapper.writeValueAsString(images)).price(room.getPrice())
                    .hourlyPrice(room.getHourlyPrice())
                    .build();
            return ResponseEntity.ok(ApiResponse.success("Image deleted", roomService.updateRoom(id, roomDTO)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error(e.getMessage()));
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
