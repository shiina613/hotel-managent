import axiosClient from './axiosClient';

const roomApi = {
  // Get all rooms
  getAllRooms: () => {
    return axiosClient.get('/rooms');
  },

  // Get room by ID
  getRoomById: (id) => {
    return axiosClient.get(`/rooms/${id}`);
  },

  // Get available rooms
  getAvailableRooms: () => {
    return axiosClient.get('/rooms/available');
  },

  // Get rooms by status
  getRoomsByStatus: (status) => {
    return axiosClient.get(`/rooms/status/${status}`);
  },

  // Get rooms by type
  getRoomsByType: (roomTypeId) => {
    return axiosClient.get(`/rooms/type/${roomTypeId}`);
  },

  // Search rooms
  searchRooms: (keyword) => {
    return axiosClient.get('/rooms/search', {
      params: { keyword }
    });
  },

  // Create room
  createRoom: (roomData) => {
    return axiosClient.post('/rooms', roomData);
  },

  // Update room
  updateRoom: (id, roomData) => {
    return axiosClient.put(`/rooms/${id}`, roomData);
  },

  // Delete room
  deleteRoom: (id) => {
    return axiosClient.delete(`/rooms/${id}`);
  },

  // Upload room image
  uploadRoomImage: async (roomId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axiosClient.post(`/rooms/${roomId}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Không thể tải ảnh lên';
    }
  },

  // Get room image URL
  getRoomImage: async (roomId) => {
    try {
      const response = await axiosClient.get(`/rooms/${roomId}/image`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Không thể lấy URL ảnh';
    }
  }
};

export default roomApi;
