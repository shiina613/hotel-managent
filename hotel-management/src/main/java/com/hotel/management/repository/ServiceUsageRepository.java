package com.hotel.management.repository;

import com.hotel.management.entity.ServiceUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ServiceUsageRepository extends JpaRepository<ServiceUsage, Integer> {

    List<ServiceUsage> findByBookingId(Integer bookingId);

    List<ServiceUsage> findByServiceId(Integer serviceId);

    @Query("SELECT su FROM ServiceUsage su WHERE su.booking.id = :bookingId ORDER BY su.useAt DESC")
    List<ServiceUsage> findServiceUsageByBookingId(@Param("bookingId") Integer bookingId);

    @Query("SELECT su FROM ServiceUsage su WHERE su.service.id = :serviceId ORDER BY su.useAt DESC")
    List<ServiceUsage> findServiceUsageByServiceId(@Param("serviceId") Integer serviceId);

    @Query("SELECT SUM(su.totalPrice) FROM ServiceUsage su WHERE su.booking.id = :bookingId")
    Integer getTotalServicePriceByBooking(@Param("bookingId") Integer bookingId);

    @Query("SELECT su FROM ServiceUsage su WHERE su.useAt >= :startDate AND su.useAt <= :endDate")
    List<ServiceUsage> findServiceUsageByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(su) FROM ServiceUsage su WHERE su.service.id = :serviceId")
    long countByServiceId(@Param("serviceId") Integer serviceId);
}
