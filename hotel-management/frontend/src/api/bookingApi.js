import axiosClient from './axiosClient';

const bookingApi = {
  // Tạo đặt phòng mới
  createBooking: async (bookingData) => {
    try {
      const response = await axiosClient.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Không thể tạo đặt phòng';
    }
  },

  // Lấy tất cả đặt phòng
  getAllBookings: async () => {
    try {
      const response = await axiosClient.get('/bookings');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Không thể tải danh sách đặt phòng';
    }
  },

  // Lấy đặt phòng theo ID
  getBookingById: async (id) => {
    try {
      const response = await axiosClient.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Không thể tải thông tin đặt phòng';
    }
  },

  // Lấy đặt phòng theo trạng thái
  getBookingsByStatus: async (status) => {
    try {
      const response = await axiosClient.get(`/bookings/status/${status}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Không thể tải danh sách đặt phòng';
    }
  },

  // Lấy đặt phòng hiện tại
  getCurrentBookings: async () => {
    try {
      const response = await axiosClient.get('/bookings/current');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Không thể tải danh sách đặt phòng hiện tại';
    }
  },

  // Cập nhật đặt phòng
  updateBooking: async (id, bookingData) => {
    try {
      const response = await axiosClient.put(`/bookings/${id}`, bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Không thể cập nhật đặt phòng';
    }
  },

  // Cập nhật trạng thái đặt phòng
  updateBookingStatus: async (id, status) => {
    try {
      const response = await axiosClient.patch(`/bookings/${id}/status/${status}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Không thể cập nhật trạng thái đặt phòng';
    }
  },

  // Xóa đặt phòng
  deleteBooking: async (id) => {
    try {
      const response = await axiosClient.delete(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Không thể xóa đặt phòng';
    }
  }
};

export default bookingApi;
