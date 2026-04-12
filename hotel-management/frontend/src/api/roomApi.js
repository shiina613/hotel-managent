import axiosClient from './axiosClient';

const roomApi = {
  getRooms: (params) => axiosClient.get('/rooms', { params }),
  getRoomById: (id) => axiosClient.get(`/rooms/${id}`),
  createRoom: (data) => axiosClient.post('/rooms', data),
  updateRoom: (id, data) => axiosClient.put(`/rooms/${id}`, data),
  deleteRoom: (id) => axiosClient.delete(`/rooms/${id}`),
  uploadImage: (id, file, isThumb = false) => {
    const fd = new FormData();
    fd.append('image', file);
    fd.append('isThumb', isThumb);
    return axiosClient.post(`/rooms/${id}/upload-image`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteImage: (id, imageUrl) => axiosClient.delete(`/rooms/${id}/images`, { params: { imageUrl } }),
};

export default roomApi;
