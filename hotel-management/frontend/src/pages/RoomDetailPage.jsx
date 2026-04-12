import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import roomApi from '../api/roomApi';
import bookingApi from '../api/bookingApi';
import authApi from '../api/authApi';
import { toast } from '../components/ui/Toast';

const BASE = '';
const fmt = (p) => new Intl.NumberFormat('vi-VN').format(p) + ' ₫';

function parseImages(imgFolder) {
  if (!imgFolder) return { thumb: null, gallery: [] };
  try {
    if (imgFolder.startsWith('[')) {
      const arr = JSON.parse(imgFolder);
      const thumb = arr.find(u => u.startsWith('thumb:'))?.replace('thumb:', '') || null;
      const gallery = arr.filter(u => !u.startsWith('thumb:'));
      return { thumb, gallery };
    }
    return { thumb: imgFolder, gallery: [] };
  } catch { return { thumb: null, gallery: [] }; }
}

// Tính số giờ giữa 2 datetime
function calcHours(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.max(0, diff / (1000 * 60 * 60));
}

// Tính tiền: ưu tiên hourlyPrice nếu có, fallback về price/24, làm tròn lên 0.5h
function calcTotal(pricePerNight, hourlyPrice, hours) {
  if (hours <= 0) return 0;
  const rounded = Math.ceil(hours * 2) / 2;
  const ratePerHour = hourlyPrice || Math.round(pricePerNight / 24);
  return Math.round(ratePerHour * rounded);
}

// Giờ tối thiểu để check-in (hiện tại + 3h, làm tròn lên 30 phút)
function getMinCheckIn() {
  const min = new Date(Date.now() + 3 * 60 * 60 * 1000);
  min.setSeconds(0, 0);
  // làm tròn lên 30 phút
  const m = min.getMinutes();
  if (m > 0 && m <= 30) min.setMinutes(30);
  else if (m > 30) { min.setHours(min.getHours() + 1); min.setMinutes(0); }
  return min;
}

function toLocalDateTimeStr(date) {
  const pad = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function BookingModal({ room, onClose, onSuccess }) {
  const user = authApi.getCurrentUser();
  const minCheckIn = getMinCheckIn();
  const minCheckInStr = toLocalDateTimeStr(minCheckIn);

  // Giá trị mặc định: check-in = minCheckIn, check-out = minCheckIn + 4h
  const defaultCheckOut = new Date(minCheckIn.getTime() + 4 * 60 * 60 * 1000);
  const [form, setForm] = useState({
    checkIn: minCheckInStr,
    checkOut: toLocalDateTimeStr(defaultCheckOut),
    note: '',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const hours = calcHours(form.checkIn, form.checkOut);
  const total = calcTotal(room.price, room.hourlyPrice, hours);
  const displayHours = hours > 0 ? (Math.ceil(hours * 2) / 2) : 0;
  const effectiveHourlyRate = room.hourlyPrice || Math.round(room.price / 24);

  const handleCheckInChange = (val) => {
    const newCheckIn = new Date(val);
    const newCheckOut = new Date(newCheckIn.getTime() + 4 * 60 * 60 * 1000);
    setForm(p => ({ ...p, checkIn: val, checkOut: toLocalDateTimeStr(newCheckOut) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.checkIn || !form.checkOut) { setErr('Vui lòng chọn thời gian nhận và trả phòng'); return; }

    const checkInDate = new Date(form.checkIn);
    const checkOutDate = new Date(form.checkOut);

    if (checkOutDate <= checkInDate) { setErr('Thời gian trả phòng phải sau thời gian nhận phòng'); return; }
    if (hours < 1) { setErr('Thời gian lưu trú tối thiểu là 1 giờ'); return; }

    const minAllowed = new Date(Date.now() + 3 * 60 * 60 * 1000);
    if (checkInDate < minAllowed) {
      setErr('Thời gian nhận phòng phải sau ít nhất 3 tiếng kể từ bây giờ');
      return;
    }

    setSaving(true); setErr('');
    try {
      await bookingApi.createBooking({
        userId: user.userId,
        roomId: room.id,
        checkInAt: form.checkIn + ':00',
        checkOutAt: form.checkOut + ':00',
        roomPrice: room.price,
        totalPrice: total,
        status: 'PENDING',
        note: form.note,
      });
      toast.success('Đặt phòng thành công! Vui lòng chờ lễ tân xác nhận.');
      onSuccess();
    } catch (e) {
      setErr(typeof e === 'string' ? e : 'Đặt phòng thất bại, vui lòng thử lại');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-lg">Đặt phòng {room.roomNumber}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
            Đặt phòng phải trước ít nhất 3 tiếng. Tính tiền theo giờ thực tế (làm tròn lên 30 phút).
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nhận phòng</label>
            <input type="datetime-local" min={minCheckInStr} value={form.checkIn}
              onChange={e => handleCheckInChange(e.target.value)}
              className="input-field" required />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Trả phòng</label>
            <input type="datetime-local" min={form.checkIn} value={form.checkOut}
              onChange={e => setForm(p => ({ ...p, checkOut: e.target.value }))}
              className="input-field" required />
          </div>

          {hours > 0 && (
            <div className="bg-primary-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Giá theo đêm</span>
                <span>{fmt(room.price)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Giá theo giờ {!room.hourlyPrice && <span className="text-gray-400">(tự tính)</span>}</span>
                <span>{fmt(effectiveHourlyRate)} / giờ</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Thời gian lưu trú</span>
                <span>{displayHours} giờ</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-primary-100">
                <span>Tổng cộng</span>
                <span className="text-primary-500">{fmt(total)}</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Ghi chú (tùy chọn)</label>
            <textarea value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
              rows={2} placeholder="Yêu cầu đặc biệt..."
              className="input-field resize-none" />
          </div>

          {err && <p className="text-sm text-red-500">{err}</p>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
              Hủy
            </button>
            <button type="submit" disabled={saving || hours < 1}
              className="flex-1 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 disabled:opacity-50 transition-colors">
              {saving ? 'Đang gửi...' : 'Xác nhận đặt phòng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = authApi.getCurrentUser();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    roomApi.getRoomById(id)
      .then(r => { setRoom(r?.data); })
      .catch(() => navigate('/home'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-400">Đang tải...</div>
    </div>
  );
  if (!room) return null;

  const { thumb, gallery } = parseImages(room.imgFolder);
  const allImages = [thumb, ...gallery].filter(Boolean);
  const displayImg = activeImg || (thumb ? BASE + thumb : null);

  const STATUS = { AVAILABLE: 'Còn trống', OCCUPIED: 'Đang có khách', MAINTENANCE: 'Bảo trì' };
  const STATUS_COLOR = {
    AVAILABLE: 'text-green-600 bg-green-50',
    OCCUPIED: 'text-red-600 bg-red-50',
    MAINTENANCE: 'text-yellow-600 bg-yellow-50',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-lg">Etheric Hotel</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/home" className="text-sm text-gray-600 hover:text-primary-500 font-medium">← Quay lại</Link>
            <Link to="/my-bookings" className="text-sm text-primary-500 hover:text-primary-600 font-medium">Đặt phòng của tôi</Link>
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 text-sm font-semibold">{user?.fullName?.charAt(0) || 'U'}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="rounded-2xl overflow-hidden bg-gray-200 aspect-video mb-3">
              {displayImg
                ? <img src={displayImg} alt={room.roomNumber} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
              }
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((url, i) => (
                  <button key={i} onClick={() => setActiveImg(BASE + url)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      (activeImg === BASE + url || (!activeImg && i === 0))
                        ? 'border-primary-500' : 'border-transparent hover:border-gray-300'
                    }`}>
                    <img src={BASE + url} alt={`img-${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Phòng {room.roomNumber}</h1>
                <p className="text-gray-500 mt-1">{room.roomTypeName}</p>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${STATUS_COLOR[room.status] || 'text-gray-600 bg-gray-100'}`}>
                {STATUS[room.status] || room.status}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-primary-500">{fmt(room.price)}</span>
              <span className="text-gray-400">/ đêm</span>
              {room.hourlyPrice && (
                <span className="ml-2 text-lg text-gray-500">· {fmt(room.hourlyPrice)}<span className="text-sm text-gray-400"> / giờ</span></span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Sức chứa</p>
                <p className="font-semibold text-gray-900">{room.capacity} khách</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Loại phòng</p>
                <p className="font-semibold text-gray-900">{room.roomTypeName || '-'}</p>
              </div>
            </div>

            {room.description && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Mô tả</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{room.description}</p>
              </div>
            )}

            {room.status === 'AVAILABLE' ? (
              <button onClick={() => setShowBooking(true)}
                className="w-full py-4 bg-primary-500 text-white rounded-xl font-semibold text-lg hover:bg-primary-600 transition-colors">
                Đặt phòng ngay
              </button>
            ) : (
              <div className="w-full py-4 bg-gray-100 text-gray-400 rounded-xl font-semibold text-lg text-center">
                Phòng hiện không khả dụng
              </div>
            )}

            <Link to="/my-bookings"
              className="mt-3 block text-center text-sm text-primary-500 hover:text-primary-600">
              Xem đơn đặt phòng của tôi →
            </Link>
          </div>
        </div>
      </div>

      {showBooking && (
        <BookingModal
          room={room}
          onClose={() => setShowBooking(false)}
          onSuccess={() => { setShowBooking(false); navigate('/my-bookings'); }}
        />
      )}
    </div>
  );
}
