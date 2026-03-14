import axiosClient from './axiosClient';

const invoiceApi = {
  // Tạo hóa đơn mới
  createInvoice: async (invoiceData) => {
    try {
      const response = await axiosClient.post('/invoices', invoiceData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Không thể tạo hóa đơn';
    }
  },

  // Lấy tất cả hóa đơn
  getAllInvoices: async () => {
    try {
      const response = await axiosClient.get('/invoices');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Không thể tải danh sách hóa đơn';
    }
  },

  // Lấy hóa đơn theo ID
  getInvoiceById: async (id) => {
    try {
      const response = await axiosClient.get(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Không thể tải thông tin hóa đơn';
    }
  },

  // Lấy hóa đơn theo trạng thái
  getInvoicesByStatus: async (status) => {
    try {
      const response = await axiosClient.get(`/invoices/status/${status}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Không thể tải danh sách hóa đơn';
    }
  },

  // Lấy hóa đơn chưa thanh toán
  getUnpaidInvoices: async () => {
    try {
      const response = await axiosClient.get('/invoices/unpaid');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Không thể tải danh sách hóa đơn chưa thanh toán';
    }
  },

  // Cập nhật hóa đơn
  updateInvoice: async (id, invoiceData) => {
    try {
      const response = await axiosClient.put(`/invoices/${id}`, invoiceData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Không thể cập nhật hóa đơn';
    }
  },

  // Cập nhật trạng thái hóa đơn
  updateInvoiceStatus: async (id, status) => {
    try {
      const response = await axiosClient.patch(`/invoices/${id}/status/${status}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Không thể cập nhật trạng thái hóa đơn';
    }
  },

  // Đánh dấu đã thanh toán
  markAsPaid: async (id, paymentMethod) => {
    try {
      const response = await axiosClient.patch(`/invoices/${id}/mark-as-paid/${paymentMethod}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Không thể đánh dấu hóa đơn đã thanh toán';
    }
  },

  // Xóa hóa đơn
  deleteInvoice: async (id) => {
    try {
      const response = await axiosClient.delete(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Không thể xóa hóa đơn';
    }
  }
};

export default invoiceApi;
