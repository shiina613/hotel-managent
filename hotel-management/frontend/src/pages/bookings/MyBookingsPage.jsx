import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bookingApi from '../../api/bookingApi';
import authApi from '../../api/authApi';
import { toast } from '../../components/ui/Toast';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const SL = {
  PENDING: 'Chờ duyệt',
  CONFIRMED: 'Đã xác nhận',
  CHECKED_IN: 'Đang ở',
  CHECKED_OUT: 'Đã trả phòng',
  CANCELLED: 'Đã hủy',
};
const SB = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  CHECKED_IN: 'bg-green-100 text-green-700',
  CHECKED_OUT: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-600',
};

const fmt = (p) => new Intl.NumberFormat('vi-VN').format(p) + ' ₫';
const fmtDate = (d) => d ? new Date(d).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const user = authApi.getCurrentUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const load = () => {
    setLoading(true);
    bookingApi.getBookings({ userId: user?.userId })
      .then(r => {
        const data = r?.data;
        if (data && typeof data === 'object' && 'content' in data) {
          setBookings(data.content || []);
        } else {
          setBookings(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    try {
      await bookingApi.updateBookingStatus(id, 'CANCELLED');
      toast.success('Đã hủy đặt phòng');
      load();
    } catch { toast.error('Hủy thất bại'); }
    setConfirm({ open: false, id: null });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
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
            <Link to="/home" className="text-sm text-gray-600 hover:text-primary-500 font-medium">← Trang chủ</Link>
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 text-sm font-semibold">{user?.fullName?.charAt(0) || 'U'}</span>
            </div>
            <span className="hidden md:block text-sm text-gray-700 font-medium">{user?.fullName}</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Đặt phòng của tôi</h1>
            <p className="text-sm text-gray-500 mt-1">Quản lý các đơn đặt phòng của bạn</p>
          </div>
          <Link to="/home"
            className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors">
            + Đặt phòng mới
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Đang tải...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <p className="text-gray-500 font-medium">Bạn chưa có đơn đặt phòng nào</p>
            <Link to="/home" className="mt-3 inline-block text-primary-500 text-sm hover:underline">Khám phá phòng ngay</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => (
              <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-bold text-gray-900 text-lg">Phòng {b.roomNumber}</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${SB[b.status] || 'bg-gray-100 text-gray-600'}`}>
                        {SL[b.status] || b.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs mb-0.5">Nhận phòng</p>
                        <p className="font-medium text-gray-700">{fmtDate(b.checkInAt)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-0.5">Trả phòng</p>
                        <p className="font-medium text-gray-700">{fmtDate(b.checkOutAt)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-0.5">Thời gian</p>
                        <p className="font-medium text-gray-700">
                          {b.checkInAt && b.checkOutAt ? (() => {
                            const h = (new Date(b.checkOutAt) - new Date(b.checkInAt)) / (1000 * 60 * 60);
                            return h >= 24 ? `${Math.round(h/24 * 10)/10} ngày` : `${Math.ceil(h * 2) / 2} giờ`;
                          })() : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-0.5">Tổng tiền</p>
                        <p className="font-semibold text-primary-500">{fmt(b.totalPrice)}</p>
                      </div>
                    </div>
                    {b.note && (
                      <p className="mt-3 text-sm text-gray-500 italic">Ghi chú: {b.note}</p>
                    )}
                  </div>
                  {b.status === 'PENDING' && (
                    <button
                      onClick={() => setConfirm({ open: true, id: b.id })}
                      className="flex-shrink-0 px-3 py-1.5 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                      Hủy
                    </button>
                  )}
                </div>

                {b.status === 'PENDING' && (
                  <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2 text-xs text-yellow-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Đang chờ lễ tân xác nhận
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirm.open}
        title="Hủy đặt phòng"
        message="Bạn có chắc muốn hủy đơn đặt phòng này không?"
        onConfirm={() => handleCancel(confirm.id)}
        onCancel={() => setConfirm({ open: false, id: null })}
      />
    </div>
  );
}
