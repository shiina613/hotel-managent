import { useState, useEffect } from 'react';
import invoiceApi from '../../api/invoiceApi';

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await invoiceApi.getAllInvoices();
      
      if (response.success) {
        setInvoices(response.data || []);
      } else {
        setError(response.message || 'Không thể tải danh sách hóa đơn');
      }
    } catch (err) {
      setError(err || 'Không thể tải danh sách hóa đơn');
      console.error('Lỗi khi tải hóa đơn:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = async (status) => {
    setStatusFilter(status);
    
    if (!status) {
      fetchInvoices();
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await invoiceApi.getInvoicesByStatus(status);
      
      if (response.success) {
        setInvoices(response.data || []);
      }
    } catch (err) {
      setError(err || 'Lọc thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchKeyword('');
    setStatusFilter('');
    fetchInvoices();
  };

  const handleMarkAsPaid = async (invoiceId, paymentMethod) => {
    try {
      const response = await invoiceApi.markAsPaid(invoiceId, paymentMethod);
      
      if (response.success) {
        fetchInvoices();
        alert('Đánh dấu đã thanh toán thành công!');
      } else {
        alert(response.message || 'Không thể đánh dấu đã thanh toán');
      }
    } catch (err) {
      alert(err || 'Không thể đánh dấu đã thanh toán');
      console.error('Lỗi khi đánh dấu đã thanh toán:', err);
    }
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hóa đơn này?')) {
      return;
    }

    try {
      const response = await invoiceApi.deleteInvoice(invoiceId);
      
      if (response.success) {
        fetchInvoices();
        alert('Xóa hóa đơn thành công!');
      } else {
        alert(response.message || 'Không thể xóa hóa đơn');
      }
    } catch (err) {
      alert(err || 'Không thể xóa hóa đơn');
      console.error('Lỗi khi xóa hóa đơn:', err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PAID: 'bg-green-100 text-green-800',
      PARTIALLY_PAID: 'bg-blue-100 text-blue-800',
      OVERDUE: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      PENDING: 'Chờ thanh toán',
      PAID: 'Đã thanh toán',
      PARTIALLY_PAID: 'Thanh toán một phần',
      OVERDUE: 'Quá hạn',
      CANCELLED: 'Đã hủy'
    };
    return statusTexts[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const totalRevenue = invoices
    .filter(inv => inv.status === 'PAID')
    .reduce((sum, inv) => sum + (inv.totalPrice || 0), 0);

  const pendingAmount = invoices
    .filter(inv => inv.status === 'PENDING' || inv.status === 'OVERDUE')
    .reduce((sum, inv) => sum + (inv.totalPrice || 0), 0);

  const filteredInvoices = invoices.filter(invoice => {
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      return (
        invoice.id?.toString().includes(keyword) ||
        invoice.bookingId?.toString().includes(keyword)
      );
    }
    return true;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hóa Đơn</h1>
          <p className="text-gray-600 mt-1">Quản lý thanh toán và hóa đơn</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Tổng Hóa Đơn</p>
          <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Tổng Doanh Thu</p>
          <p className="text-2xl font-bold text-green-600">
            {totalRevenue.toLocaleString('vi-VN')} đ
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Số Tiền Chờ</p>
          <p className="text-2xl font-bold text-yellow-600">
            {pendingAmount.toLocaleString('vi-VN')} đ
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Đã Thanh Toán</p>
          <p className="text-2xl font-bold text-green-600">
            {invoices.filter(inv => inv.status === 'PAID').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm Kiếm
            </label>
            <input
              type="text"
              placeholder="Số hóa đơn hoặc mã đặt phòng..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng Thái
            </label>
            <select 
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Chờ thanh toán</option>
              <option value="PAID">Đã thanh toán</option>
              <option value="PARTIALLY_PAID">Thanh toán một phần</option>
              <option value="OVERDUE">Quá hạn</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
          <div className="flex items-end md:col-span-2">
            <button 
              onClick={handleResetFilters}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Đặt Lại
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Đang tải hóa đơn...</p>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có hóa đơn</h3>
          <p className="mt-1 text-sm text-gray-500">Danh sách hóa đơn trống.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số HĐ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đặt Phòng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiền Phòng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiền DV
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng Tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thanh Toán
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng Thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{invoice.id}</div>
                    <div className="text-xs text-gray-500">{formatDate(invoice.createAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">#{invoice.bookingId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {invoice.roomAmount?.toLocaleString('vi-VN')} đ
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {invoice.serviceAmount?.toLocaleString('vi-VN')} đ
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {invoice.totalPrice?.toLocaleString('vi-VN')} đ
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {invoice.payMethod === 'CASH' ? 'Tiền mặt' : 'Chuyển khoản'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                      {getStatusText(invoice.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {invoice.status === 'PENDING' && (
                      <>
                        <button 
                          onClick={() => handleMarkAsPaid(invoice.id, 'CASH')}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Tiền mặt
                        </button>
                        <button 
                          onClick={() => handleMarkAsPaid(invoice.id, 'BANK_TRANSFER')}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          CK
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => handleDeleteInvoice(invoice.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InvoicesPage;
