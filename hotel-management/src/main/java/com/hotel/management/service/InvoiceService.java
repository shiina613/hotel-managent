package com.hotel.management.service;

import com.hotel.management.dto.InvoiceDTO;
import com.hotel.management.dto.response.PageResponse;
import com.hotel.management.enums.InvoiceStatus;
import com.hotel.management.enums.PaymentMethod;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface InvoiceService {

    InvoiceDTO createInvoice(InvoiceDTO invoiceDTO);

    InvoiceDTO updateInvoice(Integer id, InvoiceDTO invoiceDTO);

    void deleteInvoice(Integer id);

    Optional<InvoiceDTO> getInvoiceById(Integer id);

    Optional<InvoiceDTO> getInvoiceByBookingId(Integer bookingId);

    List<InvoiceDTO> getAllInvoices();

    List<InvoiceDTO> getInvoicesByStatus(InvoiceStatus status);

    List<InvoiceDTO> getInvoicesByPaymentMethod(PaymentMethod paymentMethod);

    List<InvoiceDTO> getInvoicesByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    List<InvoiceDTO> getUnpaidInvoices();

    List<InvoiceDTO> getInvoicesByUserId(Integer userId);

    List<InvoiceDTO> filterInvoices(Integer userId, Integer bookingId, InvoiceStatus status,
                                    PaymentMethod payMethod, LocalDateTime startDate, LocalDateTime endDate);

    PageResponse<InvoiceDTO> getAllInvoices(Pageable pageable);

    PageResponse<InvoiceDTO> filterInvoices(Integer userId, Integer bookingId, InvoiceStatus status,
                                            PaymentMethod payMethod, LocalDateTime startDate, LocalDateTime endDate,
                                            Pageable pageable);

    long countInvoicesByStatus(InvoiceStatus status);

    Integer getTotalRevenueByStatus(InvoiceStatus status);

    Integer getTotalRevenueByDateRangeAndStatus(LocalDateTime startDate, LocalDateTime endDate, InvoiceStatus status);

    InvoiceDTO updateInvoiceStatus(Integer id, InvoiceStatus status);

    InvoiceDTO markAsPaid(Integer id, PaymentMethod paymentMethod);
}
