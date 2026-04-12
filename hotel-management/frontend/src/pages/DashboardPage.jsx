import { useState, useEffect } from 'react';
import authApi from '../api/authApi';
import roomApi from '../api/roomApi';
import bookingApi from '../api/bookingApi';
import invoiceApi from '../api/invoiceApi';
import serviceApi from '../api/serviceApi';

const fmt = (p) => new Intl.NumberFormat('vi-VN').format(p || 0) + ' ₫';

const STATUS_BADGE = { CONFIRMED: 'badge-info', CHECKED_IN: 'badge-success', CHECKED_OUT: 'badge-gray', CANCELLED: 'badge-danger', PENDING: 'badge-warning' };
const STATUS_LABEL = { CONFIRMED: 'Đã xác nhận', CHECKED_IN: 'Đang ở', CHECKED_OUT: 'Đã trả', CANCELLED: 'Đã hủy', PENDING: 'Chờ xử lý' };

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const user = authApi.getCurrentUser();
  const [stats, setStats] = useState({ rooms: 0, available: 0, checkedIn: 0, revenue: 0, pending: 0 });
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    Promise.allSettled([roomApi.getRooms(), bookingApi.getBookings(), invoiceApi.getInvoices(), serviceApi.getServices()])
      .then(([r, b, inv]) => {
        const rooms = r.value?.data || [];
        const bks = b.value?.data || [];
        const invs = inv.value?.data || [];
        setStats({
          rooms: rooms.length,
          available: rooms.filter(x => x.status === 'AVAILABLE').length,
          checkedIn: bks.filter(x => x.status === 'CHECKED_IN').length,
          revenue: invs.filter(x => x.status === 'PAID').reduce((a, x) => a + (x.totalPrice || 0), 0),
          pending: invs.filter(x => x.status !== 'PAID').length,
        });
        setBookings(bks.slice(0, 6));
      });
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Tổng quan</h1>
        <p className="text-sm text-gray-500 mt-0.5">Chào mừng trở lại, {user?.fullName}!</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Tổng phòng" value={stats.rooms} sub={`${stats.available} phòng trống`} color="bg-primary-50"
          icon={<svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>}
        />
        <StatCard label="Đang check-in" value={stats.checkedIn} color="bg-green-50"
          icon={<svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>}
        />
        <StatCard label="Hóa đơn chờ" value={stats.pending} color="bg-yellow-50"
          icon={<svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>}
        />
        <StatCard label="Doanh thu" value={fmt(stats.revenue)} color="bg-purple-50"
          icon={<svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
        />
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
    </div>
  );
}
