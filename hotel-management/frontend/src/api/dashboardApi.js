import axiosClient from './axiosClient';

const dashboardApi = {
  /**
   * GET /api/v1/dashboard/summary
   * Returns: { revenueThisMonth, newBookingsToday, occupiedRooms, totalRooms, occupancyRate }
   */
  getSummary: () => axiosClient.get('/dashboard/summary'),

  /**
   * GET /api/v1/dashboard/revenue
   * Returns: { daily: [{date, revenue}], monthly: [{month, revenue}] }
   */
  getRevenue: () => axiosClient.get('/dashboard/revenue'),

  /**
   * GET /api/v1/dashboard/bookings/stats
   * Returns: { PENDING, CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED }
   */
  getBookingStats: () => axiosClient.get('/dashboard/bookings/stats'),

  /**
   * GET /api/v1/dashboard/rooms/occupancy
   * Returns: { occupiedRooms, totalRooms, occupancyRate }
   */
  getRoomOccupancy: () => axiosClient.get('/dashboard/rooms/occupancy'),

  /**
   * GET /api/v1/dashboard/services/top
   * Returns: [{ serviceId, serviceName, totalQuantity, totalRevenue }]
   */
  getTopServices: () => axiosClient.get('/dashboard/services/top'),
};

export default dashboardApi;
