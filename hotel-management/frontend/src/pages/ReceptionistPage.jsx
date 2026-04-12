import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../api/authApi';
import roomApi from '../api/roomApi';
import bookingApi from '../api/bookingApi';
import AdminLayout from '../components/layout/AdminLayout';

const STATUS_BADGE = { CONFIRMED: 'badge-info', CHECKED_IN: 'badge-success', CHECKED_OUT: 'badge-gray', CANCELLED: 'badge-danger', PENDING: 'badge-warning' };
const STATUS_LABEL = { CONFIRMED: 'Đã xác nhận', CHECKED_IN: 'Đang ở', CHECKED_OUT: 'Đã trả', CANCELLED: 'Đã hủy', PENDING: 'Chờ xử lý' };

export default function ReceptionistPage() {
  const navigate = useNavigate();
  const user = authApi.getCurrentUser();
  const [stats, setStats] = useState({ available: 0, checkedIn: 0, pending: 0 });
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    Promise.allSettled([
      roomApi.getRooms({ available: true }),
      bookingApi.getBookings({ status: 'CHECKED_IN' }),
      bookingApi.getBookings({ status: 'PENDING' }),
      bookingApi.getBookings(),
    ]).then(([avail, ci, pend, all]) => {
      setStats({
        available: avail.value?.data?.length || 0,
        checkedIn: ci.value?.data?.length || 0,
        pending: pend.value?.data?.length || 0,
      });
      setBookings((all.value?.data || []).slice(0, 6));
    });
  }, []);

  return (
    <AdminLayout role="RECEPTIONIST">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Dashboard Lễ tân</h1>
        <p className="text-sm text-gray-500 mt-0.5">Xin chào, {user?.fullName}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Phòng trống', value: stats.available, color: 'bg-green-50', tc: 'text-green-500', d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
          { label: 'Đang check-in', value: stats.checkedIn, color: 'bg-primary-50', tc: 'text-primary-500', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
          { label: 'Hóa đơn chờ', value: stats.pending, color: 'bg-yellow-50', tc: 'text-yellow-500', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        ].map((s, i) => (
          <div key={i} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
              <svg className={`w-6 h-6 ${s.tc}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.d}/></svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Đơn chờ duyệt', path: '/receptionist/bookings', cls: 'bg-yellow-500 text-white hover:bg-yellow-600' },
          { label: 'Check-in khách', path: '/receptionist/bookings', cls: 'bg-green-500 text-white hover:bg-green-600' },
          { label: 'Check-out khách', path: '/receptionist/bookings', cls: 'bg-primary-500 text-white hover:bg-primary-600' },
          { label: 'Danh sách phòng', path: '/receptionist/rooms', cls: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50' },
        ].map((a, i) => (
          <button key={i} onClick={() => navigate(a.path)}
            className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors ${a.cls}`}>{a.label}</button>
        ))}
      </div>

      <div className="card">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Đặt phòng gần đây</h2>
        </div>
        {bookings.length === 0
          ? <div className="py-12 text-center text-gray-400 text-sm">Chưa có dữ liệu</div>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>{['ID','Khách hàng','Phòng','Check-in','Trạng thái'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 text-gray-500">#{b.id}</td>
                      <td className="px-5 py-3 font-medium text-gray-900">{b.userName || `User #${b.userId}`}</td>
                      <td className="px-5 py-3 text-gray-600">{b.roomNumber || `Room #${b.roomId}`}</td>
                      <td className="px-5 py-3 text-gray-600">{b.checkInAt ? new Date(b.checkInAt).toLocaleDateString('vi-VN') : '-'}</td>
                      <td className="px-5 py-3"><span className={STATUS_BADGE[b.status] || 'badge-gray'}>{STATUS_LABEL[b.status] || b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </AdminLayout>
  );
}
