package com.hotel.management.controller;

import com.hotel.management.dto.BookingDTO;
import com.hotel.management.dto.request.CreateBookingRequest;
import com.hotel.management.dto.response.ApiResponse;
import com.hotel.management.enums.BookingStatus;
import com.hotel.management.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createBooking(@Valid @RequestBody CreateBookingRequest request) {
        try {
            var bookingDTO = BookingDTO.builder()
                    .userId(request.getUserId())
                    .roomId(request.getRoomId())
                    .checkInAt(request.getCheckInAt())
                    .checkOutAt(request.getCheckOutAt())
                    .roomPrice(request.getRoomPrice())
                    .totalPrice(request.getTotalPrice())
                    .status(request.getStatus())
                    .note(request.getNote())
                    .build();

            var createdBooking = bookingService.createBooking(bookingDTO);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Booking created successfully", createdBooking));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to create booking: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getBookingById(@PathVariable Integer id) {
        try {
            var booking = bookingService.getBookingById(id);

            if (booking.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Booking not found"));
            }

            return ResponseEntity.ok(ApiResponse.success("Booking retrieved successfully", booking.get()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve booking: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAllBookings() {
        try {
            List<BookingDTO> bookings = bookingService.getAllBookings();
            return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookings));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve bookings: " + e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<?>> getBookingsByUser(@PathVariable Integer userId) {
        try {
            List<BookingDTO> bookings = bookingService.getBookingsByUser(userId);
            return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookings));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve bookings: " + e.getMessage()));
        }
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<ApiResponse<?>> getBookingsByRoom(@PathVariable Integer roomId) {
        try {
            List<BookingDTO> bookings = bookingService.getBookingsByRoom(roomId);
            return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookings));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve bookings: " + e.getMessage()));
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<?>> getBookingsByStatus(@PathVariable BookingStatus status) {
        try {
            List<BookingDTO> bookings = bookingService.getBookingsByStatus(status);
            return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookings));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve bookings: " + e.getMessage()));
        }
    }

    @GetMapping("/date-range")
    public ResponseEntity<ApiResponse<?>> getBookingsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<BookingDTO> bookings = bookingService.getBookingsByDateRange(startDate, endDate);
            return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookings));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve bookings: " + e.getMessage()));
        }
    }

    @GetMapping("/current")
    public ResponseEntity<ApiResponse<?>> getCurrentBookings() {
        try {
            List<BookingDTO> bookings = bookingService.getCurrentBookings();
            return ResponseEntity.ok(ApiResponse.success("Current bookings retrieved successfully", bookings));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve current bookings: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateBooking(@PathVariable Integer id, @Valid @RequestBody CreateBookingRequest request) {
        try {
            var bookingDTO = BookingDTO.builder()
                    .userId(request.getUserId())
                    .roomId(request.getRoomId())
                    .checkInAt(request.getCheckInAt())
                    .checkOutAt(request.getCheckOutAt())
                    .roomPrice(request.getRoomPrice())
                    .totalPrice(request.getTotalPrice())
                    .status(request.getStatus())
                    .note(request.getNote())
                    .build();

            var updatedBooking = bookingService.updateBooking(id, bookingDTO);

            return ResponseEntity.ok(ApiResponse.success("Booking updated successfully", updatedBooking));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update booking: " + e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status/{status}")
    public ResponseEntity<ApiResponse<?>> updateBookingStatus(@PathVariable Integer id, @PathVariable BookingStatus status) {
        try {
            var updatedBooking = bookingService.updateBookingStatus(id, status);
            return ResponseEntity.ok(ApiResponse.success("Booking status updated successfully", updatedBooking));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update booking status: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteBooking(@PathVariable Integer id) {
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.ok(ApiResponse.success("Booking deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete booking: " + e.getMessage()));
        }
    }
}
