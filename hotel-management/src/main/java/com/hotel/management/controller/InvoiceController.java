package com.hotel.management.controller;

import com.hotel.management.dto.InvoiceDTO;
import com.hotel.management.dto.request.CreateInvoiceRequest;
import com.hotel.management.dto.response.ApiResponse;
import com.hotel.management.enums.InvoiceStatus;
import com.hotel.management.enums.PaymentMethod;
import com.hotel.management.service.InvoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

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

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getInvoices(
            @RequestParam(required = false) Integer userId,
            @RequestParam(required = false) Integer bookingId,
            @RequestParam(required = false) InvoiceStatus status,
            @RequestParam(required = false) PaymentMethod paymentMethod,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<InvoiceDTO> invoices;
            if (userId != null || bookingId != null || status != null || paymentMethod != null
                    || startDate != null || endDate != null) {
                invoices = invoiceService.filterInvoices(userId, bookingId, status, paymentMethod, startDate, endDate);
            } else {
                invoices = invoiceService.getAllInvoices();
            }
            return ResponseEntity.ok(ApiResponse.success("Invoices retrieved successfully", invoices));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve invoices: " + e.getMessage()));
        }
    }

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
