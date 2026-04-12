import axiosClient from './axiosClient';
const serviceApi = {
  getServices: (params) => axiosClient.get('/services', { params }),
  getServiceById: (id) => axiosClient.get(`/services/${id}`),
  createService: (data) => axiosClient.post('/services', data),
  updateService: (id, data) => axiosClient.put(`/services/${id}`, data),
  deleteService: (id) => axiosClient.delete(`/services/${id}`),
};
export default serviceApi;
