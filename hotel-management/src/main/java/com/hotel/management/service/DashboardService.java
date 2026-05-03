package com.hotel.management.service;

import com.hotel.management.dto.response.*;

import java.util.List;

public interface DashboardService {

    /**
     * Returns summary statistics: revenue this month, new bookings today,
     * occupied rooms, total rooms, and occupancy rate.
     */
    DashboardSummaryResponse getSummary();

    /**
     * Returns daily revenue for the last 30 days and monthly revenue for the last 12 months,
     * calculated from PAID invoices.
     */
    RevenueResponse getRevenue();

    /**
     * Returns booking counts grouped by each BookingStatus.
     */
    BookingStatsResponse getBookingStats();

    /**
     * Returns room occupancy: number of rooms with active CHECKED_IN bookings vs total rooms.
     */
    RoomOccupancyResponse getRoomOccupancy();

    /**
     * Returns top 5 services by total quantity used and total revenue generated.
     */
    List<TopServiceResponse> getTopServices();
}
