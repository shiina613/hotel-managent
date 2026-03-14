import axiosClient from './axiosClient';

const serviceApi = {
  // Get all services
  getAllServices: async () => {
    try {
      const response = await axiosClient.get('/services');
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error.response?.data?.message || 'Không thể tải danh sách dịch vụ';
    }
  },

  // Get service by ID
  getServiceById: async (id) => {
    try {
      const response = await axiosClient.get(`/services/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching service:', error);
      throw error.response?.data?.message || 'Không thể tải thông tin dịch vụ';
    }
  },

  // Get active services only
  getActiveServices: async () => {
    try {
      const response = await axiosClient.get('/services/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active services:', error);
      throw error.response?.data?.message || 'Không thể tải danh sách dịch vụ đang hoạt động';
    }
  },

  // Search services
  searchServices: async (keyword) => {
    try {
      const response = await axiosClient.get('/services/search', {
        params: { keyword }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching services:', error);
      throw error.response?.data?.message || 'Không thể tìm kiếm dịch vụ';
    }
  },

  // Create service
  createService: async (serviceData) => {
    try {
      const response = await axiosClient.post('/services', serviceData);
      return response.data;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error.response?.data?.message || 'Không thể tạo dịch vụ';
    }
  },

  // Update service
  updateService: async (id, serviceData) => {
    try {
      const response = await axiosClient.put(`/services/${id}`, serviceData);
      return response.data;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error.response?.data?.message || 'Không thể cập nhật dịch vụ';
    }
  },

  // Delete service
  deleteService: async (id) => {
    try {
      const response = await axiosClient.delete(`/services/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error.response?.data?.message || 'Không thể xóa dịch vụ';
    }
  }
};

export default serviceApi;
