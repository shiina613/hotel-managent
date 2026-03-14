import axiosClient from './axiosClient';

const roomTypeApi = {
  // Get all room types
  getAllRoomTypes: () => {
    return axiosClient.get('/room-types');
  },

  // Get room type by ID
  getRoomTypeById: (id) => {
    return axiosClient.get(`/room-types/${id}`);
  },

  // Create room type
  createRoomType: (roomTypeData) => {
    return axiosClient.post('/room-types', roomTypeData);
  },

  // Update room type
  updateRoomType: (id, roomTypeData) => {
    return axiosClient.put(`/room-types/${id}`, roomTypeData);
  },

  // Delete room type
  deleteRoomType: (id) => {
    return axiosClient.delete(`/room-types/${id}`);
  }
};

export default roomTypeApi;
