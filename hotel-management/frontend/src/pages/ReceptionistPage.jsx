import { useNavigate } from 'react-router-dom';
import authApi from '../api/authApi';

const ReceptionistPage = () => {
  const navigate = useNavigate();
  const user = authApi.getCurrentUser();

  const handleLogout = () => {
    authApi.logout();
    navigate('/login');
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4 border-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản Lý Khách Sạn - Lễ Tân</h1>
            <p className="text-sm text-gray-600">Chào mừng, {user?.fullName || user?.username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Đăng Xuất
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Xin chào, {user?.fullName || user?.username}!
          </h2>
          <p className="text-gray-600 text-lg">
            Đây là trang quản lý dành cho lễ tân. Bạn có thể quản lý đặt phòng, khách hàng và các dịch vụ.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
            <p className="text-gray-600 text-sm font-medium">Đặt Phòng Hôm Nay</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
          </div>
          <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-600">
            <p className="text-gray-600 text-sm font-medium">Phòng Trống</p>
            <p className="text-3xl font-bold text-green-600 mt-2">0</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-600">
            <p className="text-gray-600 text-sm font-medium">Khách Đang Ở</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">0</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-6 border-l-4 border-orange-600">
            <p className="text-gray-600 text-sm font-medium">Doanh Thu Hôm Nay</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">0 ₫</p>
          </div>
        </div>

        {/* Main Functions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Bookings Management */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
               onClick={() => navigateTo('/bookings')}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Quản Lý Đặt Phòng</h3>
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">Tạo, chỉnh sửa và quản lý các đặt phòng</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Quản Lý Đặt Phòng
            </button>
          </div>

          {/* Rooms Management */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
               onClick={() => navigateTo('/rooms')}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Quản Lý Phòng</h3>
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m-4 4l-4-4m9-5l4-4m-4 4l4 4" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">Xem trạng thái phòng và cập nhật thông tin</p>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Quản Lý Phòng
            </button>
          </div>

          {/* Services Management */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
               onClick={() => navigateTo('/services')}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Quản Lý Dịch Vụ</h3>
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">Quản lý các dịch vụ khách sạn</p>
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Quản Lý Dịch Vụ
            </button>
          </div>

          {/* Invoices Management */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
               onClick={() => navigateTo('/invoices')}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Quản Lý Hóa Đơn</h3>
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">Tạo và quản lý hóa đơn cho khách</p>
            <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              Quản Lý Hóa Đơn
            </button>
          </div>

          {/* Room Types */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
               onClick={() => navigateTo('/room-types')}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Loại Phòng</h3>
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">Quản lý các loại phòng khác nhau</p>
            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Quản Lý Loại Phòng
            </button>
          </div>
        </div>

        {/* User Info Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Thông Tin Tài Khoản</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên Đăng Nhập</label>
              <p className="text-gray-900 font-semibold">{user?.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Họ Tên</label>
              <p className="text-gray-900 font-semibold">{user?.fullName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <p className="text-gray-900 font-semibold">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vai Trò</label>
              <p className="text-gray-900 font-semibold">{user?.role === 'RECEPTIONIST' ? 'Lễ Tân' : user?.role}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReceptionistPage;
