package com.hotel.management.controller;

import com.hotel.management.dto.response.*;
import com.hotel.management.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Dashboard API — ADMIN only.
 * Access is restricted to ADMIN role via SecurityConfig (/api/v1/dashboard/**).
 */
@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Slf4j
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * GET /api/v1/dashboard/summary
     * Returns: revenueThisMonth, newBookingsToday, occupiedRooms, totalRooms, occupancyRate
     */
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getSummary() {
        try {
            DashboardSummaryResponse summary = dashboardService.getSummary();
            return ResponseEntity.ok(ApiResponse.success("Dashboard summary retrieved successfully", summary));
        } catch (Exception e) {
            log.error("Failed to retrieve dashboard summary", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve dashboard summary: " + e.getMessage()));
        }
    }

    /**
     * GET /api/v1/dashboard/revenue
     * Returns: daily revenue for last 30 days + monthly revenue for last 12 months (PAID invoices only)
     */
    @GetMapping("/revenue")
    public ResponseEntity<ApiResponse<RevenueResponse>> getRevenue() {
        try {
            RevenueResponse revenue = dashboardService.getRevenue();
            return ResponseEntity.ok(ApiResponse.success("Revenue data retrieved successfully", revenue));
        } catch (Exception e) {
            log.error("Failed to retrieve revenue data", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve revenue data: " + e.getMessage()));
        }
    }

    /**
     * GET /api/v1/dashboard/bookings/stats
     * Returns: booking counts per BookingStatus (PENDING, CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED)
     */
    @GetMapping("/bookings/stats")
    public ResponseEntity<ApiResponse<BookingStatsResponse>> getBookingStats() {
        try {
            BookingStatsResponse stats = dashboardService.getBookingStats();
            return ResponseEntity.ok(ApiResponse.success("Booking stats retrieved successfully", stats));
        } catch (Exception e) {
            log.error("Failed to retrieve booking stats", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve booking stats: " + e.getMessage()));
        }
    }

    /**
     * GET /api/v1/dashboard/rooms/occupancy
     * Returns: occupiedRooms (CHECKED_IN bookings), totalRooms, occupancyRate
     */
    @GetMapping("/rooms/occupancy")
    public ResponseEntity<ApiResponse<RoomOccupancyResponse>> getRoomOccupancy() {
        try {
            RoomOccupancyResponse occupancy = dashboardService.getRoomOccupancy();
            return ResponseEntity.ok(ApiResponse.success("Room occupancy retrieved successfully", occupancy));
        } catch (Exception e) {
            log.error("Failed to retrieve room occupancy", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve room occupancy: " + e.getMessage()));
        }
    }

    /**
     * GET /api/v1/dashboard/services/top
     * Returns: top 5 services by quantity used and revenue generated
     */
    @GetMapping("/services/top")
    public ResponseEntity<ApiResponse<List<TopServiceResponse>>> getTopServices() {
        try {
            List<TopServiceResponse> topServices = dashboardService.getTopServices();
            return ResponseEntity.ok(ApiResponse.success("Top services retrieved successfully", topServices));
        } catch (Exception e) {
            log.error("Failed to retrieve top services", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve top services: " + e.getMessage()));
        }
    }
}
