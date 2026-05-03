package com.hotel.management.controller;

import com.hotel.management.dto.response.*;
import com.hotel.management.service.DashboardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DashboardService dashboardService;

    private DashboardSummaryResponse summaryResponse;
    private RevenueResponse revenueResponse;
    private BookingStatsResponse bookingStatsResponse;
    private RoomOccupancyResponse roomOccupancyResponse;
    private List<TopServiceResponse> topServicesResponse;

    @BeforeEach
    void setUp() {
        // Setup mock data
        summaryResponse = DashboardSummaryResponse.builder()
                .revenueThisMonth(15000000L)
                .newBookingsToday(3L)
                .occupiedRooms(12L)
                .totalRooms(20L)
                .occupancyRate(0.6)
                .build();

        List<DailyRevenueResponse> dailyRevenue = new ArrayList<>();
        dailyRevenue.add(DailyRevenueResponse.builder().date("2024-04-01").revenue(500000L).build());
        dailyRevenue.add(DailyRevenueResponse.builder().date("2024-04-02").revenue(750000L).build());

        List<MonthlyRevenueResponse> monthlyRevenue = new ArrayList<>();
        monthlyRevenue.add(MonthlyRevenueResponse.builder().month("2024-01").revenue(10000000L).build());
        monthlyRevenue.add(MonthlyRevenueResponse.builder().month("2024-02").revenue(12000000L).build());

        revenueResponse = RevenueResponse.builder()
                .daily(dailyRevenue)
                .monthly(monthlyRevenue)
                .build();

        bookingStatsResponse = BookingStatsResponse.builder()
                .pending(5L)
                .confirmed(10L)
                .checkedIn(8L)
                .checkedOut(20L)
                .cancelled(3L)
                .total(46L)
                .build();

        roomOccupancyResponse = RoomOccupancyResponse.builder()
                .occupiedRooms(12L)
                .totalRooms(20L)
                .occupancyRate(0.6)
                .build();

        topServicesResponse = new ArrayList<>();
        topServicesResponse.add(TopServiceResponse.builder()
                .serviceId(1)
                .serviceName("Spa")
                .totalQuantity(50L)
                .totalRevenue(5000000L)
                .build());
        topServicesResponse.add(TopServiceResponse.builder()
                .serviceId(2)
                .serviceName("Laundry")
                .totalQuantity(40L)
                .totalRevenue(2000000L)
                .build());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetSummary_Success() throws Exception {
        when(dashboardService.getSummary()).thenReturn(summaryResponse);

        mockMvc.perform(get("/api/v1/dashboard/summary")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.revenueThisMonth").value(15000000))
                .andExpect(jsonPath("$.data.newBookingsToday").value(3))
                .andExpect(jsonPath("$.data.occupiedRooms").value(12))
                .andExpect(jsonPath("$.data.totalRooms").value(20))
                .andExpect(jsonPath("$.data.occupancyRate").value(0.6));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetRevenue_Success() throws Exception {
        when(dashboardService.getRevenue()).thenReturn(revenueResponse);

        mockMvc.perform(get("/api/v1/dashboard/revenue")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.daily").isArray())
                .andExpect(jsonPath("$.data.daily[0].date").value("2024-04-01"))
                .andExpect(jsonPath("$.data.daily[0].revenue").value(500000))
                .andExpect(jsonPath("$.data.monthly").isArray())
                .andExpect(jsonPath("$.data.monthly[0].month").value("2024-01"))
                .andExpect(jsonPath("$.data.monthly[0].revenue").value(10000000));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetBookingStats_Success() throws Exception {
        when(dashboardService.getBookingStats()).thenReturn(bookingStatsResponse);

        mockMvc.perform(get("/api/v1/dashboard/bookings/stats")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.pending").value(5))
                .andExpect(jsonPath("$.data.confirmed").value(10))
                .andExpect(jsonPath("$.data.checkedIn").value(8))
                .andExpect(jsonPath("$.data.checkedOut").value(20))
                .andExpect(jsonPath("$.data.cancelled").value(3))
                .andExpect(jsonPath("$.data.total").value(46));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetRoomOccupancy_Success() throws Exception {
        when(dashboardService.getRoomOccupancy()).thenReturn(roomOccupancyResponse);

        mockMvc.perform(get("/api/v1/dashboard/rooms/occupancy")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.occupiedRooms").value(12))
                .andExpect(jsonPath("$.data.totalRooms").value(20))
                .andExpect(jsonPath("$.data.occupancyRate").value(0.6));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetTopServices_Success() throws Exception {
        when(dashboardService.getTopServices()).thenReturn(topServicesResponse);

        mockMvc.perform(get("/api/v1/dashboard/services/top")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].serviceId").value(1))
                .andExpect(jsonPath("$.data[0].serviceName").value("Spa"))
                .andExpect(jsonPath("$.data[0].totalQuantity").value(50))
                .andExpect(jsonPath("$.data[0].totalRevenue").value(5000000));
    }

    @Test
    @WithMockUser(roles = "RECEPTIONIST")
    void testGetSummary_Forbidden_ForReceptionist() throws Exception {
        // Dashboard endpoints should be ADMIN only
        mockMvc.perform(get("/api/v1/dashboard/summary")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void testGetSummary_Forbidden_ForCustomer() throws Exception {
        // Dashboard endpoints should be ADMIN only
        mockMvc.perform(get("/api/v1/dashboard/summary")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void testGetSummary_Unauthorized_WithoutAuth() throws Exception {
        // Without authentication, should return 401
        mockMvc.perform(get("/api/v1/dashboard/summary")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }
}
