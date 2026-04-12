package com.hotel.management.repository;

import com.hotel.management.entity.Booking;
import com.hotel.management.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {

    List<Booking> findByUserId(Integer userId);

    List<Booking> findByRoomId(Integer roomId);

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByUserIdAndStatus(Integer userId, BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.checkInAt >= :startDate AND b.checkOutAt <= :endDate")
    List<Booking> findBookingsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT b FROM Booking b WHERE " +
           "(:userId IS NULL OR b.user.id = :userId) AND " +
           "(:roomId IS NULL OR b.room.id = :roomId) AND " +
           "(:status IS NULL OR b.status = :status) AND " +
           "(:startDate IS NULL OR b.checkInAt >= :startDate) AND " +
           "(:endDate IS NULL OR b.checkOutAt <= :endDate)")
    List<Booking> filterBookings(@Param("userId") Integer userId,
                                 @Param("roomId") Integer roomId,
                                 @Param("status") BookingStatus status,
                                 @Param("startDate") LocalDateTime startDate,
                                 @Param("endDate") LocalDateTime endDate);

    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId AND b.checkInAt >= :startDate AND b.checkOutAt <= :endDate")
    List<Booking> findBookingsByRoomAndDateRange(@Param("roomId") Integer roomId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT b FROM Booking b WHERE b.status = :status ORDER BY b.createAt DESC")
    List<Booking> findRecentBookings(@Param("status") BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId ORDER BY b.createAt DESC")
    List<Booking> findUserBookingsOrderByCreateAtDesc(@Param("userId") Integer userId);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status")
    long countByStatus(@Param("status") BookingStatus status);

    @Query("SELECT SUM(b.totalPrice) FROM Booking b WHERE b.status = :status")
    Integer getTotalRevenueByStatus(@Param("status") BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.checkInAt <= :now AND b.checkOutAt >= :now AND b.status = :status")
    List<Booking> findCurrentBookings(@Param("now") LocalDateTime now, @Param("status") BookingStatus status);
}
