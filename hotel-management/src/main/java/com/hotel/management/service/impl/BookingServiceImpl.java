package com.hotel.management.service.impl;

import com.hotel.management.dto.BookingDTO;
import com.hotel.management.dto.response.PageResponse;
import com.hotel.management.entity.Booking;
import com.hotel.management.entity.Invoice;
import com.hotel.management.entity.Room;
import com.hotel.management.entity.User;
import com.hotel.management.enums.BookingStatus;
import com.hotel.management.enums.InvoiceStatus;
import com.hotel.management.enums.PaymentMethod;
import com.hotel.management.exception.BadRequestException;
import com.hotel.management.exception.ConflictException;
import com.hotel.management.repository.BookingRepository;
import com.hotel.management.repository.InvoiceRepository;
import com.hotel.management.repository.RoomRepository;
import com.hotel.management.repository.UserRepository;
import com.hotel.management.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final InvoiceRepository invoiceRepository;

    // Valid state machine transitions: fromStatus -> set of allowed toStatuses
    private static final Map<BookingStatus, Set<BookingStatus>> VALID_TRANSITIONS = Map.of(
            BookingStatus.PENDING, EnumSet.of(BookingStatus.CONFIRMED, BookingStatus.CANCELLED),
            BookingStatus.CONFIRMED, EnumSet.of(BookingStatus.CHECKED_IN, BookingStatus.CANCELLED),
            BookingStatus.CHECKED_IN, EnumSet.of(BookingStatus.CHECKED_OUT),
            BookingStatus.CHECKED_OUT, EnumSet.noneOf(BookingStatus.class),
            BookingStatus.CANCELLED, EnumSet.noneOf(BookingStatus.class)
    );

    @Override
    public BookingDTO createBooking(BookingDTO bookingDTO) {
        // 10.3 Validate checkInDate < checkOutDate
        if (bookingDTO.getCheckInAt() == null || bookingDTO.getCheckOutAt() == null) {
            throw new BadRequestException("Check-in and check-out dates are required");
        }
        if (!bookingDTO.getCheckInAt().isBefore(bookingDTO.getCheckOutAt())) {
            throw new BadRequestException("Ngày check-in phải trước ngày check-out");
        }
        // 10.3 Validate checkInDate >= today
        if (bookingDTO.getCheckInAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Ngày check-in không thể là ngày trong quá khứ");
        }

        User user = userRepository.findById(bookingDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + bookingDTO.getUserId()));

        Room room = roomRepository.findById(bookingDTO.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + bookingDTO.getRoomId()));

        // 10.2 Conflict check — only CONFIRMED or CHECKED_IN bookings block the room
        boolean hasConflict = bookingRepository.existsConflict(
                bookingDTO.getRoomId(),
                bookingDTO.getCheckInAt(),
                bookingDTO.getCheckOutAt(),
                null
        );
        if (hasConflict) {
            throw new ConflictException("Phòng đã được đặt trong khoảng thời gian này");
        }

        Booking booking = Booking.builder()
                .user(user)
                .room(room)
                .checkInAt(bookingDTO.getCheckInAt())
                .checkOutAt(bookingDTO.getCheckOutAt())
                .roomPrice(bookingDTO.getRoomPrice())
                .totalPrice(bookingDTO.getTotalPrice())
                // 10.2 Always set initial status to PENDING
                .status(BookingStatus.PENDING)
                .note(bookingDTO.getNote())
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        log.info("Booking created with id={}, roomId={}, userId={}, status=PENDING",
                savedBooking.getId(), bookingDTO.getRoomId(), bookingDTO.getUserId());
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
    public PageResponse<BookingDTO> getAllBookings(Pageable pageable) {
        return PageResponse.from(bookingRepository.findAll(pageable).map(this::mapToDTO));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<BookingDTO> filterBookings(Integer userId, Integer roomId, BookingStatus status,
                                                   LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return PageResponse.from(
                bookingRepository.filterBookings(userId, roomId, status, startDate, endDate, pageable)
                        .map(this::mapToDTO));
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

    /**
     * 10.4 / 10.5 / 10.6 / 10.8
     * Update booking status with state machine validation.
     * Validates allowed transitions, checks role permissions, and auto-creates Invoice on CHECKED_OUT.
     */
    @Override
    @Transactional
    public BookingDTO updateStatus(Integer bookingId, BookingStatus newStatus, String currentUser) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));

        BookingStatus currentStatus = booking.getStatus();

        // 10.5 Validate state machine transition
        Set<BookingStatus> allowedTransitions = VALID_TRANSITIONS.getOrDefault(
                currentStatus, EnumSet.noneOf(BookingStatus.class));

        if (!allowedTransitions.contains(newStatus)) {
            throw new BadRequestException(
                    String.format("Chuyển đổi trạng thái không hợp lệ: %s → %s. Các trạng thái hợp lệ từ %s: %s",
                            currentStatus, newStatus, currentStatus,
                            allowedTransitions.isEmpty() ? "không có" : allowedTransitions));
        }

        // Role-based permission check
        String callerRole = getCurrentUserRole();
        validateRoleForTransition(currentStatus, newStatus, callerRole, currentUser, booking);

        booking.setStatus(newStatus);
        Booking updatedBooking = bookingRepository.save(booking);

        // 10.6 Auto-create Invoice when transitioning to CHECKED_OUT
        if (newStatus == BookingStatus.CHECKED_OUT) {
            createInvoiceForCheckout(updatedBooking);
        }

        log.info("Booking id={} status changed: {} → {} by user={}",
                bookingId, currentStatus, newStatus, currentUser);
        return mapToDTO(updatedBooking);
    }

    /**
     * Validates that the caller's role is permitted to perform the given transition.
     * State machine permissions:
     *   PENDING → CONFIRMED: RECEPTIONIST/ADMIN
     *   PENDING → CANCELLED: CUSTOMER/RECEPTIONIST/ADMIN
     *   CONFIRMED → CHECKED_IN: RECEPTIONIST/ADMIN
     *   CONFIRMED → CANCELLED: CUSTOMER/RECEPTIONIST/ADMIN
     *   CHECKED_IN → CHECKED_OUT: RECEPTIONIST/ADMIN
     */
    private void validateRoleForTransition(BookingStatus from, BookingStatus to,
                                           String role, String currentUser, Booking booking) {
        boolean isAdminOrReceptionist = "ROLE_ADMIN".equals(role) || "ROLE_RECEPTIONIST".equals(role);
        boolean isCustomer = "ROLE_CUSTOMER".equals(role);

        if (to == BookingStatus.CANCELLED) {
            // CUSTOMER can only cancel their own bookings
            if (isCustomer) {
                if (!booking.getUser().getUsername().equals(currentUser)) {
                    throw new com.hotel.management.exception.ForbiddenException(
                            "Bạn không có quyền hủy booking của người dùng khác");
                }
                // CUSTOMER cannot cancel CHECKED_IN or CHECKED_OUT
                if (from == BookingStatus.CHECKED_IN || from == BookingStatus.CHECKED_OUT) {
                    throw new BadRequestException(
                            "Không thể hủy booking đã check-in hoặc đã hoàn thành");
                }
            } else if (!isAdminOrReceptionist) {
                throw new com.hotel.management.exception.ForbiddenException(
                        "Bạn không có quyền thực hiện thao tác này");
            }
        } else {
            // All other transitions require RECEPTIONIST or ADMIN
            if (!isAdminOrReceptionist) {
                throw new com.hotel.management.exception.ForbiddenException(
                        "Chỉ RECEPTIONIST hoặc ADMIN mới có thể thực hiện thao tác này");
            }
        }
    }

    /**
     * 10.6 Auto-create Invoice when booking transitions to CHECKED_OUT.
     * totalAmount = booking.totalPrice + sum(serviceUsage.totalPrice)
     * Invoice status = PENDING (chưa thanh toán)
     */
    private void createInvoiceForCheckout(Booking booking) {
        // Check if invoice already exists (idempotency)
        if (invoiceRepository.findByBookingId(booking.getId()).isPresent()) {
            log.warn("Invoice already exists for booking id={}, skipping creation", booking.getId());
            return;
        }

        int roomAmount = booking.getTotalPrice() != null ? booking.getTotalPrice() : 0;
        int serviceAmount = booking.getServiceUsages().stream()
                .mapToInt(su -> su.getTotalPrice() != null ? su.getTotalPrice() : 0)
                .sum();
        int totalAmount = roomAmount + serviceAmount;

        Invoice invoice = Invoice.builder()
                .booking(booking)
                .roomAmount(roomAmount)
                .serviceAmount(serviceAmount)
                .totalPrice(totalAmount)
                .payMethod(PaymentMethod.CASH) // default, can be updated when paying
                .status(InvoiceStatus.PENDING)
                .note("Tự động tạo khi check-out")
                .build();

        invoiceRepository.save(invoice);
        log.info("Invoice auto-created for booking id={}, totalAmount={}", booking.getId(), totalAmount);
    }

    /**
     * Extract the current user's role from Spring Security context.
     */
    private String getCurrentUserRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return "";
        }
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("");
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
