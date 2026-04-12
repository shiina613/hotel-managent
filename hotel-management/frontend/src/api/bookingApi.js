import axiosClient from './axiosClient';
const bookingApi = {
  getBookings: (params) => axiosClient.get('/bookings', { params }),
  getBookingById: (id) => axiosClient.get(`/bookings/${id}`),
  getCurrentBookings: () => axiosClient.get('/bookings/current'),
  createBooking: (data) => axiosClient.post('/bookings', data),
  updateBooking: (id, data) => axiosClient.put(`/bookings/${id}`, data),
  updateBookingStatus: (id, status) => axiosClient.patch(`/bookings/${id}/status/${status}`),
  deleteBooking: (id) => axiosClient.delete(`/bookings/${id}`),
};
export default bookingApi;
