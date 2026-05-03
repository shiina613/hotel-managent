package com.hotel.management.service;

import com.hotel.management.dto.BookingDTO;
import com.hotel.management.dto.response.PageResponse;
import com.hotel.management.enums.BookingStatus;
import org.springframework.data.domain.Pageable;

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

    PageResponse<BookingDTO> getAllBookings(Pageable pageable);

    PageResponse<BookingDTO> filterBookings(Integer userId, Integer roomId, BookingStatus status,
                                            LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    long countBookingsByStatus(BookingStatus status);

    Integer getTotalRevenueByStatus(BookingStatus status);

    BookingDTO updateBookingStatus(Integer id, BookingStatus status);

    /**
     * Update booking status with state machine validation.
     * Validates that the transition is allowed based on the current status and the caller's role.
     * When transitioning to CHECKED_OUT, automatically creates an Invoice.
     *
     * @param bookingId   the booking ID
     * @param newStatus   the desired new status
     * @param currentUser the username of the user performing the action (from SecurityContext)
     * @return updated BookingDTO
     */
    BookingDTO updateStatus(Integer bookingId, BookingStatus newStatus, String currentUser);
}
