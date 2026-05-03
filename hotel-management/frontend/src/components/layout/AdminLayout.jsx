import { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import authApi from '../../api/authApi';
import bookingApi from '../../api/bookingApi';

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState([]);
  const ref = useRef(null);

  const load = () => {
    bookingApi.getBookings({ status: 'PENDING', size: 10 })
      .then(r => {
        const data = r?.data;
        const list = data?.content ?? (Array.isArray(data) ? data : []);
        setPending(list);
      })
      .catch(() => {});
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fmtTime = (d) => d ? new Date(d).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(p => !p)}
        className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
        {pending.length > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="font-semibold text-gray-900 text-sm">Đặt phòng chờ duyệt</span>
            {pending.length > 0 && (
              <span className="text-xs bg-red-100 text-red-600 font-medium px-2 py-0.5 rounded-full">{pending.length}</span>
            )}
          </div>

          {pending.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-400 text-sm">Không có thông báo mới</div>
          ) : (
            <ul className="max-h-72 overflow-y-auto divide-y divide-gray-50">
              {pending.map(b => (
                <li key={b.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Phòng {b.roomNumber} <span className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full ml-1">Chờ duyệt</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{b.userName || `User #${b.userId}`}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{fmtTime(b.checkInAt)} → {fmtTime(b.checkOutAt)}</p>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">#{b.id}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="px-4 py-2.5 border-t border-gray-100">
            <a href="/bookings" className="text-xs text-primary-500 hover:text-primary-600 font-medium">
              Xem tất cả đặt phòng →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

const AdminLayout = ({ children, role }) => {
  const user = authApi.getCurrentUser();
  const r = role || user?.role || 'ADMIN';
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar role={r} />
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-100 h-14 flex items-center justify-end px-6 sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 text-sm font-semibold">{user?.fullName?.charAt(0) || 'U'}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
