package com.hotel.management.service.impl;

import com.hotel.management.dto.InvoiceDTO;
import com.hotel.management.entity.Booking;
import com.hotel.management.entity.Invoice;
import com.hotel.management.enums.InvoiceStatus;
import com.hotel.management.enums.PaymentMethod;
import com.hotel.management.repository.BookingRepository;
import com.hotel.management.repository.InvoiceRepository;
import com.hotel.management.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final BookingRepository bookingRepository;

    @Override
    public InvoiceDTO createInvoice(InvoiceDTO invoiceDTO) {
        Booking booking = bookingRepository.findById(invoiceDTO.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + invoiceDTO.getBookingId()));

        Invoice invoice = Invoice.builder()
                .booking(booking)
                .roomAmount(invoiceDTO.getRoomAmount())
                .serviceAmount(invoiceDTO.getServiceAmount())
                .totalPrice(invoiceDTO.getTotalPrice())
                .payMethod(invoiceDTO.getPayMethod())
                .status(invoiceDTO.getStatus())
                .note(invoiceDTO.getNote())
                .build();

        Invoice savedInvoice = invoiceRepository.save(invoice);
        return mapToDTO(savedInvoice);
    }

    @Override
    public InvoiceDTO updateInvoice(Integer id, InvoiceDTO invoiceDTO) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + id));

        if (!invoice.getBooking().getId().equals(invoiceDTO.getBookingId())) {
            Booking booking = bookingRepository.findById(invoiceDTO.getBookingId())
                    .orElseThrow(() -> new RuntimeException("Booking not found with id: " + invoiceDTO.getBookingId()));
            invoice.setBooking(booking);
        }

        invoice.setRoomAmount(invoiceDTO.getRoomAmount());
        invoice.setServiceAmount(invoiceDTO.getServiceAmount());
        invoice.setTotalPrice(invoiceDTO.getTotalPrice());
        invoice.setPayMethod(invoiceDTO.getPayMethod());
        invoice.setStatus(invoiceDTO.getStatus());
        invoice.setNote(invoiceDTO.getNote());

        Invoice updatedInvoice = invoiceRepository.save(invoice);
        return mapToDTO(updatedInvoice);
    }

    @Override
    public void deleteInvoice(Integer id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + id));
        invoiceRepository.delete(invoice);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<InvoiceDTO> getInvoiceById(Integer id) {
        return invoiceRepository.findById(id).map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<InvoiceDTO> getInvoiceByBookingId(Integer bookingId) {
        return invoiceRepository.findByBookingId(bookingId).map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceDTO> getAllInvoices() {
        return invoiceRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceDTO> getInvoicesByStatus(InvoiceStatus status) {
        return invoiceRepository.findByStatus(status).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceDTO> getInvoicesByPaymentMethod(PaymentMethod paymentMethod) {
        return invoiceRepository.findByPayMethod(paymentMethod).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceDTO> getInvoicesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return invoiceRepository.findInvoicesByDateRange(startDate, endDate).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceDTO> getUnpaidInvoices() {
        return invoiceRepository.findUnpaidInvoices(InvoiceStatus.PAID).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceDTO> getInvoicesByUserId(Integer userId) {
        return invoiceRepository.findInvoicesByUserId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceDTO> filterInvoices(Integer userId, Integer bookingId, InvoiceStatus status,
                                           PaymentMethod payMethod, LocalDateTime startDate, LocalDateTime endDate) {
        return invoiceRepository.filterInvoices(userId, bookingId, status, payMethod, startDate, endDate).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long countInvoicesByStatus(InvoiceStatus status) {
        return invoiceRepository.countByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public Integer getTotalRevenueByStatus(InvoiceStatus status) {
        return invoiceRepository.getTotalRevenueByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public Integer getTotalRevenueByDateRangeAndStatus(LocalDateTime startDate, LocalDateTime endDate, InvoiceStatus status) {
        return invoiceRepository.getTotalRevenueByDateRangeAndStatus(startDate, endDate, status);
    }

    @Override
    public InvoiceDTO updateInvoiceStatus(Integer id, InvoiceStatus status) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + id));
        invoice.setStatus(status);
        Invoice updatedInvoice = invoiceRepository.save(invoice);
        return mapToDTO(updatedInvoice);
    }

    @Override
    public InvoiceDTO markAsPaid(Integer id, PaymentMethod paymentMethod) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + id));
        invoice.setStatus(InvoiceStatus.PAID);
        invoice.setPayMethod(paymentMethod);
        invoice.setPaidAt(LocalDateTime.now());
        Invoice updatedInvoice = invoiceRepository.save(invoice);
        return mapToDTO(updatedInvoice);
    }

    private InvoiceDTO mapToDTO(Invoice invoice) {
        return InvoiceDTO.builder()
                .id(invoice.getId())
                .bookingId(invoice.getBooking().getId())
                .createAt(invoice.getCreateAt())
                .roomAmount(invoice.getRoomAmount())
                .serviceAmount(invoice.getServiceAmount())
                .totalPrice(invoice.getTotalPrice())
                .payMethod(invoice.getPayMethod())
                .status(invoice.getStatus())
                .paidAt(invoice.getPaidAt())
                .note(invoice.getNote())
                .updateAt(invoice.getUpdateAt())
                .build();
    }
}
