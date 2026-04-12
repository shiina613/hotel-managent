package com.hotel.management.service;

import com.hotel.management.dto.BookingDTO;
import com.hotel.management.enums.BookingStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingService {

    BookingDTO createBooking(BookingDTO bookingDTO);

    BookingDTO updateBooking(Integer id, BookingDTO bookingDTO);

    void deleteBooking(Integer id);

    Optional<BookingDTO> getBookingById(Integer id);

    List<BookingDTO> getAllBookings();

    List<BookingDTO> getBookingsByUser(Integer userId);

    List<BookingDTO> getBookingsByRoom(Integer roomId);

    List<BookingDTO> getBookingsByStatus(BookingStatus status);

    List<BookingDTO> getBookingsByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    List<BookingDTO> getBookingsByRoomAndDateRange(Integer roomId, LocalDateTime startDate, LocalDateTime endDate);

    List<BookingDTO> getCurrentBookings();

    List<BookingDTO> filterBookings(Integer userId, Integer roomId, BookingStatus status,
                                    LocalDateTime startDate, LocalDateTime endDate);

    long countBookingsByStatus(BookingStatus status);

    Integer getTotalRevenueByStatus(BookingStatus status);

    BookingDTO updateBookingStatus(Integer id, BookingStatus status);
}
