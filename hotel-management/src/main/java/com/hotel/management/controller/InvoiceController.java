package com.hotel.management.controller;

import com.hotel.management.dto.InvoiceDTO;
import com.hotel.management.dto.request.CreateInvoiceRequest;
import com.hotel.management.dto.response.ApiResponse;
import com.hotel.management.dto.response.PageResponse;
import com.hotel.management.enums.InvoiceStatus;
import com.hotel.management.enums.PaymentMethod;
import com.hotel.management.service.InvoiceService;
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
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/invoices")
@RequiredArgsConstructor
@Tag(name = "Invoices", description = "Quản lý hóa đơn — tạo, thanh toán, xem lịch sử")
public class InvoiceController {

    private final InvoiceService invoiceService;

    @Operation(
        summary = "Tạo hóa đơn mới",
        description = "Tạo hóa đơn cho một booking. Thông thường được tạo tự động khi booking chuyển sang CHECKED_OUT."
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Tạo hóa đơn thành công"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Chưa xác thực")
    })
    @PostMapping
    public ResponseEntity<ApiResponse<?>> createInvoice(@Valid @RequestBody CreateInvoiceRequest request) {
        try {
            var invoiceDTO = InvoiceDTO.builder()
                    .bookingId(request.getBookingId())
                    .roomAmount(request.getRoomAmount())
                    .serviceAmount(request.getServiceAmount())
                    .totalPrice(request.getTotalPrice())
                    .payMethod(request.getPayMethod())
                    .status(request.getStatus())
                    .note(request.getNote())
                    .build();

            var createdInvoice = invoiceService.createInvoice(invoiceDTO);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Invoice created successfully", createdInvoice));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to create invoice: " + e.getMessage()));
        }
    }

    @Operation(summary = "Lấy hóa đơn theo ID")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tìm thấy hóa đơn"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Chưa xác thực")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getInvoiceById(@PathVariable Integer id) {
        try {
            var invoice = invoiceService.getInvoiceById(id);

            if (invoice.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Invoice not found"));
            }

            return ResponseEntity.ok(ApiResponse.success("Invoice retrieved successfully", invoice.get()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve invoice: " + e.getMessage()));
        }
    }

    @Operation(
        summary = "Lấy danh sách hóa đơn (có phân trang)",
        description = "Hỗ trợ lọc theo userId, bookingId, status, paymentMethod, khoảng thời gian. Mặc định page=0, size=10."
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thành công"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Chưa xác thực")
    })
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<InvoiceDTO>>> getInvoices(
            @Parameter(description = "Lọc theo ID người dùng") @RequestParam(required = false) Integer userId,
            @Parameter(description = "Lọc theo ID booking") @RequestParam(required = false) Integer bookingId,
            @Parameter(description = "Lọc theo trạng thái hóa đơn") @RequestParam(required = false) InvoiceStatus status,
            @Parameter(description = "Lọc theo phương thức thanh toán") @RequestParam(required = false) PaymentMethod paymentMethod,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @Parameter(description = "Số trang (bắt đầu từ 0)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Số bản ghi mỗi trang (tối đa 100)") @RequestParam(defaultValue = "10") int size) {
        try {
            size = Math.min(size, 100);
            Pageable pageable = PageRequest.of(page, size);
            PageResponse<InvoiceDTO> result;
            if (userId != null || bookingId != null || status != null || paymentMethod != null
                    || startDate != null || endDate != null) {
                result = invoiceService.filterInvoices(userId, bookingId, status, paymentMethod, startDate, endDate, pageable);
            } else {
                result = invoiceService.getAllInvoices(pageable);
            }
            return ResponseEntity.ok(ApiResponse.success("Invoices retrieved successfully", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve invoices: " + e.getMessage()));
        }
    }

    @Operation(summary = "Cập nhật thông tin hóa đơn")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Cập nhật thành công"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tìm thấy hóa đơn")
    })
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateInvoice(@PathVariable Integer id, @Valid @RequestBody CreateInvoiceRequest request) {
        try {
            var invoiceDTO = InvoiceDTO.builder()
                    .bookingId(request.getBookingId())
                    .roomAmount(request.getRoomAmount())
                    .serviceAmount(request.getServiceAmount())
                    .totalPrice(request.getTotalPrice())
                    .payMethod(request.getPayMethod())
                    .status(request.getStatus())
                    .note(request.getNote())
                    .build();

            var updatedInvoice = invoiceService.updateInvoice(id, invoiceDTO);

            return ResponseEntity.ok(ApiResponse.success("Invoice updated successfully", updatedInvoice));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update invoice: " + e.getMessage()));
        }
    }

    @Operation(
        summary = "Cập nhật trạng thái hóa đơn",
        description = "Chuyển trạng thái hóa đơn: UNPAID → PAID hoặc CANCELLED."
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Cập nhật thành công"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tìm thấy hóa đơn")
    })
    @PatchMapping("/{id}/status/{status}")
    public ResponseEntity<ApiResponse<?>> updateInvoiceStatus(@PathVariable Integer id, @PathVariable InvoiceStatus status) {
        try {
            var updatedInvoice = invoiceService.updateInvoiceStatus(id, status);
            return ResponseEntity.ok(ApiResponse.success("Invoice status updated successfully", updatedInvoice));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update invoice status: " + e.getMessage()));
        }
    }

    @Operation(
        summary = "Đánh dấu hóa đơn đã thanh toán",
        description = "Chuyển trạng thái hóa đơn sang PAID và ghi nhận phương thức thanh toán."
    )
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Thanh toán thành công"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Không tìm thấy hóa đơn"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Không có quyền — yêu cầu ADMIN hoặc RECEPTIONIST")
    })
    @PatchMapping("/{id}/mark-as-paid/{paymentMethod}")
    public ResponseEntity<ApiResponse<?>> markAsPaid(@PathVariable Integer id, @PathVariable PaymentMethod paymentMethod) {
        try {
            var updatedInvoice = invoiceService.markAsPaid(id, paymentMethod);
            return ResponseEntity.ok(ApiResponse.success("Invoice marked as paid successfully", updatedInvoice));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to mark invoice as paid: " + e.getMessage()));
        }
    }

    @Operation(summary = "Xóa hóa đơn")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Xóa thành công"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Không có quyền — yêu cầu ADMIN")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteInvoice(@PathVariable Integer id) {
        try {
            invoiceService.deleteInvoice(id);
            return ResponseEntity.ok(ApiResponse.success("Invoice deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete invoice: " + e.getMessage()));
        }
    }
}
