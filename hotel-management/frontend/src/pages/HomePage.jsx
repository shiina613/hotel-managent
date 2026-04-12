import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authApi from '../api/authApi';
import roomApi from '../api/roomApi';
import serviceApi from '../api/serviceApi';

const MOCK_ROOMS = [
  { name: 'Phòng Deluxe', price: 1200000, capacity: 2, img: '/images/room/anh-phong.jpg', desc: 'Phòng sang trọng với ban công và view tuyệt đẹp' },
  { name: 'Phòng Superior', price: 900000, capacity: 2, img: '/images/room/anh-phong-2.jpg', desc: 'Phòng tiêu chuẩn với đầy đủ tiện nghi hiện đại' },
  { name: 'Phòng Family', price: 1800000, capacity: 4, img: '/images/room/trang-tri-phong-khach-san-13.jpg', desc: 'Phòng rộng rãi phù hợp cho gia đình' },
];
const MOCK_SERVICES = [
  { name: 'Spa & Wellness', img: '/images/service/spa.jpg' },
  { name: 'Hồ bơi', img: '/images/service/pool.jpg' },
  { name: 'Nhà hàng', img: '/images/service/restaurant.jpg' },
  { name: 'Đưa đón sân bay', img: '/images/service/air port transfer.jpg' },
];
const MOCK_REVIEWS = [
  { name: 'Nguyễn Minh', rating: 5, content: 'Khách sạn rất đẹp, nhân viên thân thiện. Tôi sẽ quay lại!' },
  { name: 'Trần Hương', rating: 5, content: 'Dịch vụ tuyệt vời, vị trí đẹp, giá cả hợp lý.' },
  { name: 'Phạm Tuấn', rating: 4, content: 'Phòng rộng, tiện nghi đầy đủ. Tổng thể rất tốt.' },
];

const BASE = ''; // Dùng Vite proxy — không cần prefix localhost:8080

// Parse imgFolder để lấy thumb URL — xử lý mọi format
function getThumb(imgFolder) {
  if (!imgFolder) return null;
  try {
    // Format JSON array: ["thumb:/uploads/...", "/uploads/..."]
    if (imgFolder.startsWith('[')) {
      const arr = JSON.parse(imgFolder);
      if (!arr.length) return null;
      const thumbEntry = arr.find(u => u.startsWith('thumb:'));
      const url = thumbEntry ? thumbEntry.replace('thumb:', '') : arr[0];
      return url.startsWith('http') ? url : BASE + url;
    }
    // Format cũ: string đơn
    return imgFolder.startsWith('http') ? imgFolder : BASE + imgFolder;
  } catch {
    return null;
  }
}

const fmt = (p) => new Intl.NumberFormat('vi-VN').format(p) + ' ₫';

// Ảnh placeholder theo capacity (dùng Unsplash)
const PLACEHOLDER_IMGS = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80',
];

function RoomCard({ room, index = 0 }) {
  const thumb = getThumb(room.img);
  const fallback = PLACEHOLDER_IMGS[index % PLACEHOLDER_IMGS.length];
  const [src, setSrc] = useState(thumb || fallback);

  useEffect(() => { setSrc(thumb || fallback); }, [thumb]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
      <div className="h-48 overflow-hidden bg-gray-100">
        <img src={src} alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setSrc(fallback)} />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-gray-900 text-lg">{room.name}</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex-shrink-0 ml-2">{room.capacity} khách</span>
        </div>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{room.desc}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-primary-500">{fmt(room.price)}</span>
            <span className="text-gray-400 text-xs ml-1">/ đêm</span>
            {room.hourlyPrice && (
              <span className="ml-2 text-sm text-gray-500">{fmt(room.hourlyPrice)}<span className="text-gray-400 text-xs"> / giờ</span></span>
            )}
          </div>
          <Link to={room.id ? `/room/${room.id}` : '#'}
            className="bg-primary-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const user = authApi.getCurrentUser();
  const [rooms, setRooms] = useState([]);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState({ checkIn: '', checkOut: '', guests: '2' });
  const [result, setResult] = useState(null);

  useEffect(() => {
    roomApi.getRooms({ available: true }).then(r => { if (r?.data?.length) setRooms(r.data); }).catch(() => {});
    serviceApi.getServices({ active: true }).then(r => { if (r?.data?.length) setServices(r.data); }).catch(() => {});
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await roomApi.getRooms({ available: true, capacity: search.guests });
      setResult(res?.data || []);
    } catch { setResult([]); }
    document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' });
  };

  const displayRooms = result
    ? result.map(r => ({ id: r.id, name: r.roomNumber, price: r.price, hourlyPrice: r.hourlyPrice, capacity: r.capacity, img: r.imgFolder, desc: r.description }))
    : rooms.length > 0
      ? rooms.map(r => ({ id: r.id, name: r.roomNumber, price: r.price, hourlyPrice: r.hourlyPrice, capacity: r.capacity, img: r.imgFolder, desc: r.description }))
      : MOCK_ROOMS;
  const displayServices = services.length > 0 ? services : MOCK_SERVICES;

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-lg">Etheric Hotel</span>
          </div>
          <nav className="hidden md:flex items-center gap-7">
            {[['#hero','Trang chủ'],['#rooms','Phòng'],['#services','Dịch vụ'],['#contact','Liên hệ']].map(([h,l]) => (
              <a key={h} href={h} className="text-sm text-gray-600 hover:text-primary-500 transition-colors font-medium">{l}</a>
            ))}
            <Link to="/my-bookings" className="text-sm text-primary-500 hover:text-primary-600 transition-colors font-medium">Đặt phòng của tôi</Link>
          </nav>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 text-sm font-semibold">{user?.fullName?.charAt(0) || 'U'}</span>
            </div>
            <span className="hidden md:block text-sm text-gray-700 font-medium">{user?.fullName}</span>
            <button onClick={() => { authApi.logout(); navigate('/login'); }}
              className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors">Đăng xuất</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="hero" className="relative h-[520px] overflow-hidden">
        <img src="/images/banner/trang-tri-phong-khach-san-5.jpg" alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
          onError={e => { e.target.style.display = 'none'; }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(51,36,188,0.8), rgba(30,21,113,0.65))' }} />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <p className="text-primary-200 text-sm font-medium tracking-widest uppercase mb-3">Chào mừng đến với</p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Etheric Hotel</h1>
          <p className="text-primary-100 text-lg mb-8 max-w-xl">Trải nghiệm lưu trú sang trọng — nơi mỗi khoảnh khắc đều trở nên đáng nhớ</p>
          <a href="#rooms" className="px-8 py-3 rounded-xl font-semibold text-primary-600 bg-white hover:bg-primary-50 transition-colors shadow-lg">
            Khám phá phòng
          </a>
        </div>
      </section>

      {/* Search */}
      <section className="bg-white shadow-md">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs font-medium text-gray-500 mb-1">Nhận phòng</label>
              <input type="date" value={search.checkIn} onChange={e => setSearch(p => ({...p, checkIn: e.target.value}))} className="input-field" />
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs font-medium text-gray-500 mb-1">Trả phòng</label>
              <input type="date" value={search.checkOut} onChange={e => setSearch(p => ({...p, checkOut: e.target.value}))} className="input-field" />
            </div>
            <div className="w-32">
              <label className="block text-xs font-medium text-gray-500 mb-1">Số khách</label>
              <select value={search.guests} onChange={e => setSearch(p => ({...p, guests: e.target.value}))} className="input-field">
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} khách</option>)}
              </select>
            </div>
            <button type="submit" className="btn-primary px-6 py-3">Tìm phòng</button>
          </form>
        </div>
      </section>

      {/* Rooms */}
      <section id="rooms" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">
              {result ? `Kết quả tìm kiếm (${result.length} phòng)` : 'Phòng nổi bật'}
            </h2>
            <p className="text-gray-500 mt-2">Lựa chọn phòng phù hợp với nhu cầu của bạn</p>
          </div>
          {displayRooms.length === 0
            ? <p className="text-center text-gray-400 py-12">Không tìm thấy phòng phù hợp</p>
            : <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{displayRooms.map((r, i) => <RoomCard key={i} room={r} index={i} />)}</div>
          }
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Dịch vụ khách sạn</h2>
            <p className="text-gray-500 mt-2">Các dịch vụ cao cấp để kỳ nghỉ của bạn hoàn hảo hơn</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {displayServices.map((s, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow cursor-pointer">
                <div className="h-36 overflow-hidden bg-gray-100">
                  <img src={s.img || s.image} alt={s.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => { e.target.style.display = 'none'; }} />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm">{s.name}</h3>
                  {s.description && <p className="text-gray-500 text-xs mt-1 line-clamp-2">{s.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Đánh giá khách hàng</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_REVIEWS.map((r, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-900">{r.name}</h4>
                  <span>{'⭐'.repeat(r.rating)}</span>
                </div>
                <p className="text-gray-500 text-sm italic">"{r.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: '📍', title: 'Địa chỉ', lines: ['123 Đường Biển, Nha Trang', 'Khánh Hòa, Việt Nam'] },
              { icon: '📞', title: 'Hotline', lines: ['+84 (258) 123-456', '+84 (258) 123-457'] },
              { icon: '✉️', title: 'Email', lines: ['info@etherichotel.com', 'booking@etherichotel.com'] },
            ].map((c, i) => (
              <div key={i}>
                <div className="text-3xl mb-3">{c.icon}</div>
                <h3 className="font-bold text-lg mb-2">{c.title}</h3>
                {c.lines.map((l, j) => <p key={j} className="text-gray-400 text-sm">{l}</p>)}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-950 text-gray-500 py-6 text-center text-sm">
        <p>© 2024 Etheric Hotel Management. All rights reserved.</p>
      </footer>
    </div>
  );
}
