import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../api/authApi';

// Mock data
const mockRooms = [
  {
    id: 1,
    name: 'Phòng Deluxe',
    price: 1200000,
    capacity: 2,
    description: 'Phòng sang trọng với ban công và view biển tuyệt đẹp',
    amenities: ['Ban công', 'View biển', 'Minibar', 'WiFi miễn phí'],
    image: '/src/assets/images/room/anh-phong.jpg'
  },
  {
    id: 2,
    name: 'Phòng Superior',
    price: 900000,
    capacity: 2,
    description: 'Phòng tiêu chuẩn với đầy đủ tiện nghi hiện đại',
    amenities: ['Điều hòa', 'TV 42 inch', 'Minibar', 'WiFi miễn phí'],
    image: '/src/assets/images/room/anh-phong-2.jpg'
  },
  {
    id: 3,
    name: 'Phòng Family',
    price: 1800000,
    capacity: 4,
    description: 'Phòng rộng rãi phù hợp cho gia đình với 2 phòng ngủ',
    amenities: ['2 phòng ngủ', 'Phòng khách', 'Bếp nhỏ', 'WiFi miễn phí'],
    image: '/src/assets/images/room/trang-tri-phong-khach-san-13.jpg'
  }
];

const mockServices = [
  {
    id: 1,
    name: 'Spa & Wellness',
    description: 'Dịch vụ spa cao cấp với các liệu pháp truyền thống',
    image: '/src/assets/images/service/spa.jpg'
  },
  {
    id: 2,
    name: 'Hồ Bơi',
    description: 'Hồ bơi ngoài trời với view biển, mở cửa 24/7',
    image: '/src/assets/images/service/pool.jpg'
  },
  {
    id: 3,
    name: 'Nhà Hàng',
    description: 'Nhà hàng 5 sao phục vụ ẩm thực quốc tế và địa phương',
    image: '/src/assets/images/service/restaurant.jpg'
  },
  {
    id: 4,
    name: 'Đưa Đón Sân Bay',
    description: 'Dịch vụ đưa đón sân bay nhanh chóng và an toàn',
    image: '/src/assets/images/service/air port transfer.jpg'
  }
];

const mockReviews = [
  {
    id: 1,
    name: 'Nguyễn Minh',
    rating: 5,
    content: 'Khách sạn rất đẹp, nhân viên thân thiện, phòng sạch sẽ. Tôi sẽ quay lại!'
  },
  {
    id: 2,
    name: 'Trần Hương',
    rating: 5,
    content: 'Dịch vụ tuyệt vời, vị trí đẹp, giá cả hợp lý. Rất hài lòng với kỳ nghỉ của mình.'
  },
  {
    id: 3,
    name: 'Phạm Tuấn',
    rating: 4,
    content: 'Phòng rộng, tiện nghi đầy đủ. Chỉ tiếc là WiFi hơi chậm nhưng tổng thể rất tốt.'
  }
];

const HomePage = () => {
  const navigate = useNavigate();
  const user = authApi.getCurrentUser();

  const handleLogout = () => {
    authApi.logout();
    navigate('/login');
  };

  const [searchForm, setSearchForm] = useState({
    checkIn: '',
    checkOut: '',
    guests: '2',
    roomType: 'all'
  });

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    alert('Tìm kiếm phòng: ' + JSON.stringify(searchForm, null, 2));
  };

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' ₫';
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">🏨</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Luxury Hotel</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#rooms" className="text-gray-700 hover:text-blue-600 transition">Phòng</a>
            <a href="#services" className="text-gray-700 hover:text-blue-600 transition">Dịch Vụ</a>
            <a href="#reviews" className="text-gray-700 hover:text-blue-600 transition">Đánh Giá</a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 transition">Liên Hệ</a>
          </nav>
          <div className="flex items-center space-x-3">
            <span className="hidden md:block text-sm text-gray-600">
              Xin chào, <span className="font-semibold text-gray-900">{user?.fullName || user?.username}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Đăng Xuất</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
        {/* Banner Image */}
        <img 
          src="/src/assets/images/banner/trang-tri-phong-khach-san-5.jpg" 
          alt="Hotel Banner"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-blue-800/80"></div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white z-10">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">Luxury Hotel</h2>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">Trải nghiệm lưu trú sang trọng tại bãi biển đẹp nhất</p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition transform hover:scale-105">
              Đặt Phòng Ngay
            </button>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Tìm Kiếm Phòng</h3>
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Check-in Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày Nhận Phòng
                </label>
                <input
                  type="date"
                  name="checkIn"
                  value={searchForm.checkIn}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Check-out Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày Trả Phòng
                </label>
                <input
                  type="date"
                  name="checkOut"
                  value={searchForm.checkOut}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số Khách
                </label>
                <select
                  name="guests"
                  value={searchForm.guests}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1">1 khách</option>
                  <option value="2">2 khách</option>
                  <option value="3">3 khách</option>
                  <option value="4">4 khách</option>
                  <option value="5">5+ khách</option>
                </select>
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại Phòng
                </label>
                <select
                  name="roomType"
                  value={searchForm.roomType}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tất cả loại phòng</option>
                  <option value="deluxe">Phòng Deluxe</option>
                  <option value="superior">Phòng Superior</option>
                  <option value="family">Phòng Family</option>
                </select>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Tìm Phòng
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section id="rooms" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Phòng Nổi Bật</h2>
            <p className="text-gray-600 text-lg">Khám phá các phòng sang trọng của chúng tôi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockRooms.map(room => (
              <div key={room.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition transform hover:scale-105">
                {/* Room Image */}
                <div className="h-48 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center overflow-hidden relative">
                  <img 
                    src={room.image} 
                    alt={room.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fileName = room.image.split('/').pop();
                      e.target.parentElement.innerHTML = `
                        <div class="text-center w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                          <div class="text-5xl mb-2">🛏️</div>
                          <p class="text-gray-600 text-xs">Ảnh: ${fileName}</p>
                        </div>
                      `;
                    }}
                  />
                </div>

                {/* Room Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{room.name}</h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold text-blue-600">{formatPrice(room.price)}</span>
                    <span className="text-gray-600 text-sm">/ đêm</span>
                  </div>

                  <p className="text-gray-600 mb-4">{room.description}</p>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Sức chứa: {room.capacity} khách</p>
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.map((amenity, idx) => (
                        <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Xem Chi Tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Dịch Vụ Khách Sạn</h2>
            <p className="text-gray-600 text-lg">Các dịch vụ cao cấp để làm cho kỳ nghỉ của bạn hoàn hảo</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockServices.map(service => (
              <div key={service.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center">
                {/* Service Image */}
                <div className="w-full h-32 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fileName = service.image.split('/').pop();
                      const icons = {
                        'spa.jpg': '💆',
                        'pool.jpg': '🏊',
                        'restaurant.jpg': '🍽️',
                        'air port transfer.jpg': '🚗'
                      };
                      e.target.parentElement.innerHTML = `
                        <div class="text-center w-full h-full flex flex-col items-center justify-center bg-blue-100">
                          <span class="text-4xl">${icons[fileName] || '🏨'}</span>
                          <p class="text-gray-600 text-xs mt-2">${fileName}</p>
                        </div>
                      `;
                    }}
                  />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Đánh Giá Khách Hàng</h2>
            <p className="text-gray-600 text-lg">Những lời nhận xét từ khách hàng của chúng tôi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockReviews.map(review => (
              <div key={review.id} className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-900">{review.name}</h4>
                  <span className="text-yellow-400 text-lg">{renderStars(review.rating)}</span>
                </div>

                <p className="text-gray-600 italic">"{review.content}"</p>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">Khách hàng xác minh</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Address */}
            <div className="text-center">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-bold mb-2">Địa Chỉ</h3>
              <p className="text-gray-300">
                123 Đường Biển<br />
                Thành phố Nha Trang<br />
                Tỉnh Khánh Hòa, Việt Nam
              </p>
            </div>

            {/* Phone */}
            <div className="text-center">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-xl font-bold mb-2">Hotline</h3>
              <p className="text-gray-300">
                <a href="tel:+84258123456" className="hover:text-blue-400 transition">
                  +84 (258) 123-456
                </a>
                <br />
                <a href="tel:+84258123457" className="hover:text-blue-400 transition">
                  +84 (258) 123-457
                </a>
              </p>
            </div>

            {/* Email */}
            <div className="text-center">
              <div className="text-4xl mb-4">✉️</div>
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <p className="text-gray-300">
                <a href="mailto:info@luxuryhotel.com" className="hover:text-blue-400 transition">
                  info@luxuryhotel.com
                </a>
                <br />
                <a href="mailto:booking@luxuryhotel.com" className="hover:text-blue-400 transition">
                  booking@luxuryhotel.com
                </a>
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-12 pt-8 border-t border-gray-700 text-center">
            <h3 className="text-xl font-bold mb-4">Theo Dõi Chúng Tôi</h3>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-2xl hover:text-blue-400 transition">📘</a>
              <a href="#" className="text-2xl hover:text-blue-400 transition">🐦</a>
              <a href="#" className="text-2xl hover:text-blue-400 transition">📷</a>
              <a href="#" className="text-2xl hover:text-blue-400 transition">▶️</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Luxury Hotel. Bảo lưu mọi quyền.</p>
          <div className="mt-4 space-x-6">
            <a href="#" className="hover:text-white transition">Chính Sách Bảo Mật</a>
            <a href="#" className="hover:text-white transition">Điều Khoản Sử Dụng</a>
            <a href="#" className="hover:text-white transition">Liên Hệ</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
