package com.hotel.management.controller;

import com.hotel.management.dto.BookingDTO;
import com.hotel.management.dto.request.CreateBookingRequest;
import com.hotel.management.dto.request.UpdateBookingStatusRequest;
import com.hotel.management.dto.response.ApiResponse;
import com.hotel.management.dto.response.PageResponse;
import com.hotel.management.enums.BookingStatus;
import com.hotel.management.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Quản lý đặt phòng — tạo, cập nhật trạng thái, hủy booking")
public class BookingController {

    private final BookingService bookingService;

    @Operation(
        summary = "Tạo booking mới",
        description = "Tạo đặt phòng mới với trạng thái PENDING. Tự động kiểm tra xung đột lịch."
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Tạo booking thành công"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Phòng đã được đặt trong khoảng thời gian này"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ (ngày check-in/out sai)"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Chưa xác thực")
    })
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

    @Operation(summary = "Lấy booking theo ID")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tìm thấy booking"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Chưa xác thực")
    })
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

    @Operation(
        summary = "Lấy danh sách booking (có phân trang)",
        description = "Hỗ trợ lọc theo userId, roomId, status, khoảng thời gian. Mặc định page=0, size=10."
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Chưa xác thực")
    })
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<BookingDTO>>> getBookings(
            @Parameter(description = "Lọc theo ID người dùng") @RequestParam(required = false) Integer userId,
            @Parameter(description = "Lọc theo ID phòng") @RequestParam(required = false) Integer roomId,
            @Parameter(description = "Lọc theo trạng thái") @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @Parameter(description = "Số trang (bắt đầu từ 0)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Số bản ghi mỗi trang (tối đa 100)") @RequestParam(defaultValue = "10") int size) {
        try {
            size = Math.min(size, 100);
            Pageable pageable = PageRequest.of(page, size);
            PageResponse<BookingDTO> result;
            if (userId != null || roomId != null || status != null || startDate != null || endDate != null) {
                result = bookingService.filterBookings(userId, roomId, status, startDate, endDate, pageable);
            } else {
                result = bookingService.getAllBookings(pageable);
            }
            return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve bookings: " + e.getMessage()));
        }
    }

    @Operation(summary = "Lấy danh sách booking hiện tại (đang CHECKED_IN)")
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

    @Operation(summary = "Cập nhật thông tin booking")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Cập nhật thành công"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Không có quyền — yêu cầu ADMIN hoặc RECEPTIONIST")
    })
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

    @Operation(summary = "Cập nhật trạng thái booking (path variable)", deprecated = true,
        description = "Dùng PUT /{id}/status thay thế. Endpoint này không có state machine validation.")
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

    @Operation(
        summary = "Cập nhật trạng thái booking (state machine)",
        description = """
            Chuyển trạng thái booking theo state machine hợp lệ:
            - PENDING → CONFIRMED (RECEPTIONIST/ADMIN)
            - CONFIRMED → CHECKED_IN (RECEPTIONIST/ADMIN)
            - CHECKED_IN → CHECKED_OUT (RECEPTIONIST/ADMIN) — tự động tạo Invoice
            - PENDING/CONFIRMED → CANCELLED (bất kỳ role)
            """
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Cập nhật trạng thái thành công"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Chuyển trạng thái không hợp lệ"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Không có quyền — yêu cầu ADMIN hoặc RECEPTIONIST"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tìm thấy booking")
    })
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<?>> updateStatus(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateBookingStatusRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUser = authentication != null ? authentication.getName() : "anonymous";
        var updatedBooking = bookingService.updateStatus(id, request.getStatus(), currentUser);
        return ResponseEntity.ok(ApiResponse.success("Booking status updated successfully", updatedBooking));
    }

    @Operation(
        summary = "Hủy booking",
        description = """
            Hủy booking với điều kiện:
            - CUSTOMER: chỉ hủy booking của chính mình, trạng thái PENDING hoặc CONFIRMED
            - RECEPTIONIST/ADMIN: hủy bất kỳ booking PENDING hoặc CONFIRMED
            - Không thể hủy booking đã CHECKED_IN hoặc CHECKED_OUT
            """
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Hủy booking thành công"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Không thể hủy booking đã check-in hoặc hoàn thành"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Không có quyền hủy booking của người khác")
    })
    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<?>> cancelBooking(@PathVariable Integer id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUser = authentication != null ? authentication.getName() : "anonymous";
        var updatedBooking = bookingService.updateStatus(id, BookingStatus.CANCELLED, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", updatedBooking));
    }

    @Operation(summary = "Xóa booking")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Xóa thành công"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Không có quyền — yêu cầu ADMIN hoặc RECEPTIONIST")
    })
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
