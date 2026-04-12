package com.hotel.management.repository;

import com.hotel.management.entity.Invoice;
import com.hotel.management.enums.InvoiceStatus;
import com.hotel.management.enums.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {

    Optional<Invoice> findByBookingId(Integer bookingId);

    List<Invoice> findByStatus(InvoiceStatus status);

    List<Invoice> findByPayMethod(PaymentMethod payMethod);

    List<Invoice> findByStatusAndPayMethod(InvoiceStatus status, PaymentMethod payMethod);

    @Query("SELECT i FROM Invoice i WHERE i.createAt >= :startDate AND i.createAt <= :endDate")
    List<Invoice> findInvoicesByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT i FROM Invoice i WHERE " +
           "(:userId IS NULL OR i.booking.user.id = :userId) AND " +
           "(:bookingId IS NULL OR i.booking.id = :bookingId) AND " +
           "(:status IS NULL OR i.status = :status) AND " +
           "(:payMethod IS NULL OR i.payMethod = :payMethod) AND " +
           "(:startDate IS NULL OR i.createAt >= :startDate) AND " +
           "(:endDate IS NULL OR i.createAt <= :endDate)")
    List<Invoice> filterInvoices(@Param("userId") Integer userId,
                                 @Param("bookingId") Integer bookingId,
                                 @Param("status") InvoiceStatus status,
                                 @Param("payMethod") PaymentMethod payMethod,
                                 @Param("startDate") LocalDateTime startDate,
                                 @Param("endDate") LocalDateTime endDate);

    @Query("SELECT i FROM Invoice i WHERE i.status = :status ORDER BY i.createAt DESC")
    List<Invoice> findRecentInvoices(@Param("status") InvoiceStatus status);

    @Query("SELECT SUM(i.totalPrice) FROM Invoice i WHERE i.status = :status")
    Integer getTotalRevenueByStatus(@Param("status") InvoiceStatus status);

    @Query("SELECT SUM(i.totalPrice) FROM Invoice i WHERE i.createAt >= :startDate AND i.createAt <= :endDate AND i.status = :status")
    Integer getTotalRevenueByDateRangeAndStatus(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate, @Param("status") InvoiceStatus status);

    @Query("SELECT COUNT(i) FROM Invoice i WHERE i.status = :status")
    long countByStatus(@Param("status") InvoiceStatus status);

    @Query("SELECT i FROM Invoice i WHERE i.paidAt IS NULL AND i.status != :status ORDER BY i.createAt DESC")
    List<Invoice> findUnpaidInvoices(@Param("status") InvoiceStatus status);

    @Query("SELECT i FROM Invoice i WHERE i.booking.user.id = :userId ORDER BY i.createAt DESC")
    List<Invoice> findInvoicesByUserId(@Param("userId") Integer userId);
}
