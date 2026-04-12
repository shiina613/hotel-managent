import axiosClient from './axiosClient';
const roomTypeApi = {
  getRoomTypes: (params) => axiosClient.get('/room-types', { params }),
  getRoomTypeById: (id) => axiosClient.get(`/room-types/${id}`),
  createRoomType: (data) => axiosClient.post('/room-types', data),
  updateRoomType: (id, data) => axiosClient.put(`/room-types/${id}`, data),
  deleteRoomType: (id) => axiosClient.delete(`/room-types/${id}`),
};
export default roomTypeApi;
