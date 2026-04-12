import axiosClient from './axiosClient';
const invoiceApi = {
  getInvoices: (params) => axiosClient.get('/invoices', { params }),
  getInvoiceById: (id) => axiosClient.get(`/invoices/${id}`),
  createInvoice: (data) => axiosClient.post('/invoices', data),
  updateInvoice: (id, data) => axiosClient.put(`/invoices/${id}`, data),
  updateInvoiceStatus: (id, status) => axiosClient.patch(`/invoices/${id}/status/${status}`),
  markAsPaid: (id, method) => axiosClient.patch(`/invoices/${id}/mark-as-paid/${method}`),
  deleteInvoice: (id) => axiosClient.delete(`/invoices/${id}`),
};
export default invoiceApi;
