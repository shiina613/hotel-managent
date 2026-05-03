package com.hotel.management.service.impl;

import com.hotel.management.dto.response.*;
import com.hotel.management.enums.BookingStatus;
import com.hotel.management.repository.BookingRepository;
import com.hotel.management.repository.InvoiceRepository;
import com.hotel.management.repository.RoomRepository;
import com.hotel.management.repository.ServiceUsageRepository;
import com.hotel.management.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final InvoiceRepository invoiceRepository;
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final ServiceUsageRepository serviceUsageRepository;

    @Override
    public DashboardSummaryResponse getSummary() {
        log.debug("Fetching dashboard summary");

        // Revenue this month: from first day of current month to now
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfMonth = startOfMonth.plusMonths(1);
        Long revenueThisMonth = invoiceRepository.getRevenueThisMonth(startOfMonth, endOfMonth);

        // New bookings today: from midnight today to midnight tomorrow
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        LocalDateTime endOfToday = startOfToday.plusDays(1);
        long newBookingsToday = bookingRepository.countNewBookingsToday(startOfToday, endOfToday);

        // Occupied rooms: bookings currently CHECKED_IN
        long occupiedRooms = bookingRepository.countCheckedIn();

        // Total rooms
        long totalRooms = roomRepository.count();

        // Occupancy rate
        double occupancyRate = totalRooms > 0 ? (double) occupiedRooms / totalRooms : 0.0;

        return DashboardSummaryResponse.builder()
                .revenueThisMonth(revenueThisMonth != null ? revenueThisMonth : 0L)
                .newBookingsToday(newBookingsToday)
                .occupiedRooms(occupiedRooms)
                .totalRooms(totalRooms)
                .occupancyRate(Math.round(occupancyRate * 100.0) / 100.0)
                .build();
    }

    @Override
    public RevenueResponse getRevenue() {
        log.debug("Fetching revenue data");

        // Daily revenue: last 30 days
        LocalDateTime thirtyDaysAgo = LocalDate.now().minusDays(29).atStartOfDay();
        List<Object[]> dailyRaw = invoiceRepository.getDailyRevenue(thirtyDaysAgo);
        List<DailyRevenueResponse> daily = new ArrayList<>();
        for (Object[] row : dailyRaw) {
            String date = row[0] != null ? row[0].toString() : "";
            Long revenue = row[1] != null ? ((Number) row[1]).longValue() : 0L;
            daily.add(DailyRevenueResponse.builder()
                    .date(date)
                    .revenue(revenue)
                    .build());
        }

        // Monthly revenue: last 12 months
        LocalDateTime twelveMonthsAgo = LocalDate.now().minusMonths(11).withDayOfMonth(1).atStartOfDay();
        List<Object[]> monthlyRaw = invoiceRepository.getMonthlyRevenue(twelveMonthsAgo);
        List<MonthlyRevenueResponse> monthly = new ArrayList<>();
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("yyyy-MM");
        for (Object[] row : monthlyRaw) {
            int year = row[0] != null ? ((Number) row[0]).intValue() : 0;
            int month = row[1] != null ? ((Number) row[1]).intValue() : 0;
            Long revenue = row[2] != null ? ((Number) row[2]).longValue() : 0L;
            String monthLabel = String.format("%04d-%02d", year, month);
            monthly.add(MonthlyRevenueResponse.builder()
                    .month(monthLabel)
                    .revenue(revenue)
                    .build());
        }

        return RevenueResponse.builder()
                .daily(daily)
                .monthly(monthly)
                .build();
    }

    @Override
    public BookingStatsResponse getBookingStats() {
        log.debug("Fetching booking stats");

        List<Object[]> rawStats = bookingRepository.countByEachStatus();

        long pending = 0, confirmed = 0, checkedIn = 0, checkedOut = 0, cancelled = 0;

        for (Object[] row : rawStats) {
            BookingStatus status = (BookingStatus) row[0];
            long count = ((Number) row[1]).longValue();
            switch (status) {
                case PENDING -> pending = count;
                case CONFIRMED -> confirmed = count;
                case CHECKED_IN -> checkedIn = count;
                case CHECKED_OUT -> checkedOut = count;
                case CANCELLED -> cancelled = count;
            }
        }

        long total = pending + confirmed + checkedIn + checkedOut + cancelled;

        return BookingStatsResponse.builder()
                .pending(pending)
                .confirmed(confirmed)
                .checkedIn(checkedIn)
                .checkedOut(checkedOut)
                .cancelled(cancelled)
                .total(total)
                .build();
    }

    @Override
    public RoomOccupancyResponse getRoomOccupancy() {
        log.debug("Fetching room occupancy");

        long occupiedRooms = bookingRepository.countCheckedIn();
        long totalRooms = roomRepository.count();
        double occupancyRate = totalRooms > 0 ? (double) occupiedRooms / totalRooms : 0.0;

        return RoomOccupancyResponse.builder()
                .occupiedRooms(occupiedRooms)
                .totalRooms(totalRooms)
                .occupancyRate(Math.round(occupancyRate * 100.0) / 100.0)
                .build();
    }

    @Override
    public List<TopServiceResponse> getTopServices() {
        log.debug("Fetching top services");

        List<Object[]> rawResults = serviceUsageRepository.getTopServicesByQuantity(PageRequest.of(0, 5));
        List<TopServiceResponse> topServices = new ArrayList<>();

        for (Object[] row : rawResults) {
            Integer serviceId = row[0] != null ? ((Number) row[0]).intValue() : null;
            String serviceName = row[1] != null ? row[1].toString() : "";
            Long totalQuantity = row[2] != null ? ((Number) row[2]).longValue() : 0L;
            Long totalRevenue = row[3] != null ? ((Number) row[3]).longValue() : 0L;

            topServices.add(TopServiceResponse.builder()
                    .serviceId(serviceId)
                    .serviceName(serviceName)
                    .totalQuantity(totalQuantity)
                    .totalRevenue(totalRevenue)
                    .build());
        }

        return topServices;
    }
}
