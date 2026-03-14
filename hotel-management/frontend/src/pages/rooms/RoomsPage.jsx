import { useState, useEffect } from 'react';
import roomApi from '../../api/roomApi';
import roomTypeApi from '../../api/roomTypeApi';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRoomTypes, setLoadingRoomTypes] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomTypeId: '',
    status: 'AVAILABLE',
    description: '',
    capacity: '',
    price: ''
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Fetch rooms on component mount
  useEffect(() => {
    fetchRooms();
  }, []);

  // Fetch room types when modal opens
  useEffect(() => {
    if (showCreateModal) {
      fetchRoomTypes();
    }
  }, [showCreateModal]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await roomApi.getAllRooms();
      
      if (response.success) {
        setRooms(response.data || []);
      } else {
        setError(response.message || 'Không thể tải danh sách phòng');
      }
    } catch (err) {
      setError(err || 'Không thể tải danh sách phòng');
      console.error('Lỗi khi tải phòng:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      setLoadingRoomTypes(true);
      const response = await roomTypeApi.getAllRoomTypes();
      
      if (response.success) {
        setRoomTypes(response.data || []);
      } else {
        console.error('Không thể tải loại phòng:', response.message);
      }
    } catch (err) {
      console.error('Lỗi khi tải loại phòng:', err);
    } finally {
      setLoadingRoomTypes(false);
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      fetchRooms();
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await roomApi.searchRooms(searchKeyword);
      
      if (response.success) {
        setRooms(response.data || []);
      }
    } catch (err) {
      setError(err || 'Tìm kiếm thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = async (status) => {
    setStatusFilter(status);
    
    if (!status) {
      fetchRooms();
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await roomApi.getRoomsByStatus(status);
      
      if (response.success) {
        setRooms(response.data || []);
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
    fetchRooms();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước ảnh không được vượt quá 5MB');
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.roomNumber.trim()) {
      errors.roomNumber = 'Số phòng là bắt buộc';
    }

    if (!formData.roomTypeId) {
      errors.roomTypeId = 'Loại phòng là bắt buộc';
    }

    if (!formData.capacity || formData.capacity < 1) {
      errors.capacity = 'Sức chứa phải ít nhất là 1';
    }

    if (!formData.price || formData.price < 0) {
      errors.price = 'Giá phòng phải lớn hơn hoặc bằng 0';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setCreating(true);
      setError('');

      const roomData = {
        roomNumber: formData.roomNumber,
        roomTypeId: parseInt(formData.roomTypeId),
        status: formData.status,
        description: formData.description,
        capacity: parseInt(formData.capacity),
        imgFolder: '',
        price: parseInt(formData.price)
      };

      const response = await roomApi.createRoom(roomData);

      if (response.success) {
        const createdRoomId = response.data.id;

        // Upload image if selected
        if (selectedImage) {
          try {
            await roomApi.uploadRoomImage(createdRoomId, selectedImage);
          } catch (imgErr) {
            console.error('Lỗi khi tải ảnh lên:', imgErr);
            alert('Tạo phòng thành công nhưng không thể tải ảnh lên: ' + imgErr);
          }
        }

        // Reset form
        setFormData({
          roomNumber: '',
          roomTypeId: '',
          status: 'AVAILABLE',
          description: '',
          capacity: '',
          price: ''
        });
        setSelectedImage(null);
        setImagePreview(null);
        setFormErrors({});
        setShowCreateModal(false);
        
        // Refresh room list
        fetchRooms();
        
        // Show success message
        alert('Tạo phòng thành công!');
      } else {
        setError(response.message || 'Không thể tạo phòng');
      }
    } catch (err) {
      setError(err || 'Không thể tạo phòng');
      console.error('Lỗi khi tạo phòng:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
      return;
    }

    try {
      const response = await roomApi.deleteRoom(roomId);
      
      if (response.success) {
        // Refresh room list
        fetchRooms();
        alert('Xóa phòng thành công!');
      } else {
        alert(response.message || 'Không thể xóa phòng');
      }
    } catch (err) {
      alert(err || 'Không thể xóa phòng');
      console.error('Lỗi khi xóa phòng:', err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      AVAILABLE: 'bg-green-100 text-green-800',
      OCCUPIED: 'bg-red-100 text-red-800',
      MAINTENANCE: 'bg-yellow-100 text-yellow-800',
      RESERVED: 'bg-blue-100 text-blue-800',
      UNAVAILABLE: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      AVAILABLE: 'Còn trống',
      OCCUPIED: 'Đang sử dụng',
      MAINTENANCE: 'Bảo trì',
      RESERVED: 'Đã đặt',
      UNAVAILABLE: 'Không khả dụng'
    };
    return statusTexts[status] || status;
  };

  const roomStatuses = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED', 'UNAVAILABLE'];

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Phòng</h1>
          <p className="text-gray-600 mt-1">Quản lý phòng và tình trạng phòng</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm Phòng
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Tổng Phòng</p>
          <p className="text-2xl font-bold text-gray-900">{rooms.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Còn Trống</p>
          <p className="text-2xl font-bold text-green-600">
            {rooms.filter(r => r.status === 'AVAILABLE').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Đang Sử Dụng</p>
          <p className="text-2xl font-bold text-red-600">
            {rooms.filter(r => r.status === 'OCCUPIED').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Bảo Trì</p>
          <p className="text-2xl font-bold text-yellow-600">
            {rooms.filter(r => r.status === 'MAINTENANCE').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm Kiếm
            </label>
            <input
              type="text"
              placeholder="Số phòng..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
              {roomStatuses.map(status => (
                <option key={status} value={status}>{getStatusText(status)}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleSearch}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Tìm Kiếm
            </button>
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleResetFilters}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Đặt Lại
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Đang tải phòng...</p>
        </div>
      ) : rooms.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có phòng</h3>
          <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách tạo phòng mới.</p>
          <div className="mt-6">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm Phòng
            </button>
          </div>
        </div>
      ) : (
        /* Rooms Table */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số Phòng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại Phòng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng Thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sức Chứa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá Phòng
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {room.imgFolder && (
                        <img 
                          src={`http://localhost:8080${room.imgFolder}`}
                          alt={room.roomNumber}
                          className="w-12 h-12 rounded object-cover mr-3"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{room.roomNumber}</div>
                        {room.description && (
                          <div className="text-xs text-gray-500">{room.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">ID: {room.roomTypeId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(room.status)}`}>
                      {getStatusText(room.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{room.capacity} người</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {room.price?.toLocaleString('vi-VN')} đ
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-3">
                      Xem
                    </button>
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDeleteRoom(room.id)}
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


      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tạo Phòng Mới</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedImage(null);
                  setImagePreview(null);
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

            {/* Modal Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleCreateRoom}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Room Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số Phòng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      formErrors.roomNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="VD: 101"
                  />
                  {formErrors.roomNumber && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.roomNumber}</p>
                  )}
                </div>

                {/* Room Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại Phòng <span className="text-red-500">*</span>
                  </label>
                  {loadingRoomTypes ? (
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                      Đang tải loại phòng...
                    </div>
                  ) : roomTypes.length > 0 ? (
                    <select
                      name="roomTypeId"
                      value={formData.roomTypeId}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        formErrors.roomTypeId ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Chọn loại phòng</option>
                      {roomTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div>
                      <input
                        type="number"
                        name="roomTypeId"
                        value={formData.roomTypeId}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          formErrors.roomTypeId ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="VD: 1"
                      />
                      <p className="mt-1 text-xs text-yellow-600">
                        Không tải được loại phòng. Vui lòng tạo loại phòng trước hoặc nhập ID thủ công.
                      </p>
                    </div>
                  )}
                  {formErrors.roomTypeId && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.roomTypeId}</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng Thái <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {roomStatuses.map(status => (
                      <option key={status} value={status}>{getStatusText(status)}</option>
                    ))}
                  </select>
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sức Chứa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      formErrors.capacity ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="VD: 2"
                  />
                  {formErrors.capacity && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.capacity}</p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá Phòng (VNĐ) <span className="text-red-500">*</span>
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
                    placeholder="VD: 500000"
                  />
                  {formErrors.price && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                  )}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ảnh Phòng
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Chọn ảnh phòng (tối đa 5MB)
                  </p>
                </div>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xem Trước Ảnh
                  </label>
                  <div className="relative w-full h-48 border border-gray-300 rounded-lg overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô Tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Nhập mô tả phòng..."
                />
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedImage(null);
                    setImagePreview(null);
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
                  {creating ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang tạo...
                    </span>
                  ) : (
                    'Tạo Phòng'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsPage;
