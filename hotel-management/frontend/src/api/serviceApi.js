import axiosClient from './axiosClient';
const serviceApi = {
  getServices: (params) => axiosClient.get('/services', { params }),
  getServiceById: (id) => axiosClient.get(`/services/${id}`),
  createService: (data) => axiosClient.post('/services', data),
  updateService: (id, data) => axiosClient.put(`/services/${id}`, data),
  deleteService: (id) => axiosClient.delete(`/services/${id}`),
  uploadImage: (id, file) => {
    const fd = new FormData();
    fd.append('image', file);
    return axiosClient.post(`/services/${id}/upload-image`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
export default serviceApi;
