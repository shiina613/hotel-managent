import { useState, useEffect } from 'react';
import serviceApi from '../../api/serviceApi';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingService, setEditingService] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    unit: 'PIECE',
    isActive: true
  });

  const [formErrors, setFormErrors] = useState({});

  // Service units
  const serviceUnits = ['PIECE', 'HOUR', 'DAY', 'NIGHT', 'PERSON', 'BOTTLE', 'PLATE', 'SET'];

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await serviceApi.getAllServices();
      
      if (response.success) {
        setServices(response.data || []);
      } else {
        setError(response.message || 'Không thể tải danh sách dịch vụ');
      }
    } catch (err) {
      setError(err || 'Không thể tải danh sách dịch vụ');
      console.error('Lỗi khi tải dịch vụ:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      fetchServices();
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await serviceApi.searchServices(searchKeyword);
      
      if (response.success) {
        setServices(response.data || []);
      }
    } catch (err) {
      setError(err || 'Tìm kiếm thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    
    if (!status) {
      fetchServices();
    } else if (status === 'active') {
      setServices(prevServices => prevServices.filter(s => s.isActive));
    } else {
      setServices(prevServices => prevServices.filter(s => !s.isActive));
    }
  };

  const handleResetFilters = () => {
    setSearchKeyword('');
    setStatusFilter('');
    fetchServices();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Tên dịch vụ là bắt buộc';
    }

    if (!formData.price || formData.price < 0) {
      errors.price = 'Giá dịch vụ phải lớn hơn hoặc bằng 0';
    }

    if (!formData.unit) {
      errors.unit = 'Đơn vị là bắt buộc';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateService = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setCreating(true);
      setError('');

      const serviceData = {
        name: formData.name,
        price: parseInt(formData.price),
        unit: formData.unit,
        isActive: formData.isActive
      };

      const response = await serviceApi.createService(serviceData);

      if (response.success) {
        setFormData({
          name: '',
          price: '',
          unit: 'PIECE',
          isActive: true
        });
        setFormErrors({});
        setShowCreateModal(false);
        fetchServices();
        alert('Tạo dịch vụ thành công!');
      } else {
        setError(response.message || 'Không thể tạo dịch vụ');
      }
    } catch (err) {
      setError(err || 'Không thể tạo dịch vụ');
      console.error('Lỗi khi tạo dịch vụ:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleEditClick = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      price: service.price.toString(),
      unit: service.unit,
      isActive: service.isActive
    });
    setShowEditModal(true);
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setUpdating(true);
      setError('');

      const serviceData = {
        name: formData.name,
        price: parseInt(formData.price),
        unit: formData.unit,
        isActive: formData.isActive
      };

      const response = await serviceApi.updateService(editingService.id, serviceData);

      if (response.success) {
        setFormData({
          name: '',
          price: '',
          unit: 'PIECE',
          isActive: true
        });
        setFormErrors({});
        setShowEditModal(false);
        setEditingService(null);
        fetchServices();
        alert('Cập nhật dịch vụ thành công!');
      } else {
        setError(response.message || 'Không thể cập nhật dịch vụ');
      }
    } catch (err) {
      setError(err || 'Không thể cập nhật dịch vụ');
      console.error('Lỗi khi cập nhật dịch vụ:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleActive = async (service) => {
    try {
      const serviceData = {
        name: service.name,
        price: service.price,
        unit: service.unit,
        isActive: !service.isActive
      };

      const response = await serviceApi.updateService(service.id, serviceData);

      if (response.success) {
        fetchServices();
        alert(`Dịch vụ đã ${!service.isActive ? 'bật' : 'tắt'} thành công!`);
      } else {
        alert(response.message || 'Không thể cập nhật trạng thái dịch vụ');
      }
    } catch (err) {
      alert(err || 'Không thể cập nhật trạng thái dịch vụ');
      console.error('Lỗi khi cập nhật trạng thái:', err);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      return;
    }

    try {
      const response = await serviceApi.deleteService(serviceId);
      
      if (response.success) {
        fetchServices();
        alert('Xóa dịch vụ thành công!');
      } else {
        alert(response.message || 'Không thể xóa dịch vụ');
      }
    } catch (err) {
      alert(err || 'Không thể xóa dịch vụ');
      console.error('Lỗi khi xóa dịch vụ:', err);
    }
  };

  const getUnitText = (unit) => {
    const unitTexts = {
      PIECE: 'cái',
      HOUR: 'giờ',
      DAY: 'ngày',
      NIGHT: 'đêm',
      PERSON: 'người',
      BOTTLE: 'chai',
      PLATE: 'đĩa',
      SET: 'bộ'
    };
    return unitTexts[unit] || unit.toLowerCase();
  };

  const filteredServices = statusFilter
    ? services.filter(s => statusFilter === 'active' ? s.isActive : !s.isActive)
    : services;

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dịch Vụ</h1>
          <p className="text-gray-600 mt-1">Quản lý dịch vụ khách sạn và giá cả</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm Dịch Vụ
        </button>
      </div>

      {/* Error Message */}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Tổng Dịch Vụ</p>
          <p className="text-2xl font-bold text-gray-900">{services.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Dịch Vụ Đang Hoạt Động</p>
          <p className="text-2xl font-bold text-green-600">
            {services.filter(s => s.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Dịch Vụ Ngừng Hoạt Động</p>
          <p className="text-2xl font-bold text-gray-600">
            {services.filter(s => !s.isActive).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm Kiếm
            </label>
            <input
              type="text"
              placeholder="Tên dịch vụ..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </select>
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleResetFilters}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Đặt Lại
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Đang tải dịch vụ...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có dịch vụ</h3>
          <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách tạo dịch vụ mới.</p>
          <div className="mt-6">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm Dịch Vụ
            </button>
          </div>
        </div>
      ) : (
        /* Services Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-500">Đơn vị: {getUnitText(service.unit)}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    service.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {service.isActive ? 'Hoạt động' : 'Ngừng'}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-2xl font-bold text-primary-600">
                    {service.price.toLocaleString('vi-VN')} đ
                  </p>
                  <p className="text-sm text-gray-500">mỗi {getUnitText(service.unit)}</p>
                </div>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditClick(service)}
                    className="flex-1 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium">
                    Sửa
                  </button>
                  <button 
                    onClick={() => handleToggleActive(service)}
                    className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                    {service.isActive ? 'Tắt' : 'Bật'}
                  </button>
                  <button 
                    onClick={() => handleDeleteService(service.id)}
                    className="px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Service Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tạo Dịch Vụ Mới</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFormErrors({});
                  setError('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleCreateService}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên Dịch Vụ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    formErrors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="VD: Dịch vụ giặt ủi"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    formErrors.price ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="VD: 50000"
                />
                {formErrors.price && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đơn Vị <span className="text-red-500">*</span>
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {serviceUnits.map(unit => (
                    <option key={unit} value={unit}>{getUnitText(unit)}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Kích hoạt dịch vụ</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormErrors({});
                    setError('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={creating}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className={`px-4 py-2 rounded-lg text-white transition-colors ${
                    creating
                      ? 'bg-primary-400 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  {creating ? 'Đang tạo...' : 'Tạo Dịch Vụ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Cập Nhật Dịch Vụ</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingService(null);
                  setFormErrors({});
                  setError('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleUpdateService}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên Dịch Vụ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    formErrors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    formErrors.price ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {formErrors.price && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đơn Vị <span className="text-red-500">*</span>
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {serviceUnits.map(unit => (
                    <option key={unit} value={unit}>{getUnitText(unit)}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Kích hoạt dịch vụ</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingService(null);
                    setFormErrors({});
                    setError('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={updating}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className={`px-4 py-2 rounded-lg text-white transition-colors ${
                    updating
                      ? 'bg-primary-400 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  {updating ? 'Đang cập nhật...' : 'Cập Nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
