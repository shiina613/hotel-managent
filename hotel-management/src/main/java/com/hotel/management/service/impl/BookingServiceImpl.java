package com.hotel.management.service.impl;

import com.hotel.management.dto.BookingDTO;
import com.hotel.management.entity.Booking;
import com.hotel.management.entity.Room;
import com.hotel.management.entity.User;
import com.hotel.management.enums.BookingStatus;
import com.hotel.management.repository.BookingRepository;
import com.hotel.management.repository.RoomRepository;
import com.hotel.management.repository.UserRepository;
import com.hotel.management.service.BookingService;
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
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    @Override
    public BookingDTO createBooking(BookingDTO bookingDTO) {
        User user = userRepository.findById(bookingDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + bookingDTO.getUserId()));

        Room room = roomRepository.findById(bookingDTO.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + bookingDTO.getRoomId()));

        Booking booking = Booking.builder()
                .user(user)
                .room(room)
                .checkInAt(bookingDTO.getCheckInAt())
                .checkOutAt(bookingDTO.getCheckOutAt())
                .roomPrice(bookingDTO.getRoomPrice())
                .totalPrice(bookingDTO.getTotalPrice())
                .status(bookingDTO.getStatus())
                .note(bookingDTO.getNote())
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        return mapToDTO(savedBooking);
    }

    @Override
    public BookingDTO updateBooking(Integer id, BookingDTO bookingDTO) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

        if (!booking.getUser().getId().equals(bookingDTO.getUserId())) {
            User user = userRepository.findById(bookingDTO.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + bookingDTO.getUserId()));
            booking.setUser(user);
        }

        if (!booking.getRoom().getId().equals(bookingDTO.getRoomId())) {
            Room room = roomRepository.findById(bookingDTO.getRoomId())
                    .orElseThrow(() -> new RuntimeException("Room not found with id: " + bookingDTO.getRoomId()));
            booking.setRoom(room);
        }

        booking.setCheckInAt(bookingDTO.getCheckInAt());
        booking.setCheckOutAt(bookingDTO.getCheckOutAt());
        booking.setRoomPrice(bookingDTO.getRoomPrice());
        booking.setTotalPrice(bookingDTO.getTotalPrice());
        booking.setStatus(bookingDTO.getStatus());
        booking.setNote(bookingDTO.getNote());

        Booking updatedBooking = bookingRepository.save(booking);
        return mapToDTO(updatedBooking);
    }

    @Override
    public void deleteBooking(Integer id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        bookingRepository.delete(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<BookingDTO> getBookingById(Integer id) {
        return bookingRepository.findById(id).map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingDTO> getBookingsByUser(Integer userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingDTO> getBookingsByRoom(Integer roomId) {
        return bookingRepository.findByRoomId(roomId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingDTO> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingDTO> getBookingsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return bookingRepository.findBookingsByDateRange(startDate, endDate).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingDTO> getBookingsByRoomAndDateRange(Integer roomId, LocalDateTime startDate, LocalDateTime endDate) {
        return bookingRepository.findBookingsByRoomAndDateRange(roomId, startDate, endDate).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingDTO> getCurrentBookings() {
        return bookingRepository.findCurrentBookings(LocalDateTime.now(), BookingStatus.CHECKED_IN).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingDTO> filterBookings(Integer userId, Integer roomId, BookingStatus status,
                                           LocalDateTime startDate, LocalDateTime endDate) {
        return bookingRepository.filterBookings(userId, roomId, status, startDate, endDate).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long countBookingsByStatus(BookingStatus status) {
        return bookingRepository.countByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public Integer getTotalRevenueByStatus(BookingStatus status) {
        return bookingRepository.getTotalRevenueByStatus(status);
    }

    @Override
    public BookingDTO updateBookingStatus(Integer id, BookingStatus status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        booking.setStatus(status);
        Booking updatedBooking = bookingRepository.save(booking);
        return mapToDTO(updatedBooking);
    }

    private BookingDTO mapToDTO(Booking booking) {
        return BookingDTO.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .userName(booking.getUser().getFullName())
                .roomId(booking.getRoom().getId())
                .roomNumber(booking.getRoom().getRoomNumber())
                .createAt(booking.getCreateAt())
                .checkInAt(booking.getCheckInAt())
                .checkOutAt(booking.getCheckOutAt())
                .roomPrice(booking.getRoomPrice())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus())
                .note(booking.getNote())
                .updateAt(booking.getUpdateAt())
                .build();
    }
}
