import { useState, useEffect } from 'react';
import bookingApi from '../../api/bookingApi';
import roomApi from '../../api/roomApi';
import invoiceApi from '../../api/invoiceApi';
import authApi from '../../api/authApi';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { toast } from '../../components/ui/Toast';

const SL = { PENDING: 'Chờ duyệt', CONFIRMED: 'Đã xác nhận', CHECKED_IN: 'Đang ở', CHECKED_OUT: 'Đã trả phòng', CANCELLED: 'Đã hủy' };
const SB = { PENDING: 'badge-warning', CONFIRMED: 'badge-info', CHECKED_IN: 'badge-success', CHECKED_OUT: 'badge-gray', CANCELLED: 'badge-danger' };
const EMPTY = { userId: '', roomId: '', checkInAt: '', checkOutAt: '', roomPrice: '', totalPrice: '', status: 'PENDING', note: '' };
const PAY_METHODS = { CASH: 'Tiền mặt', CARD: 'Thẻ ngân hàng', TRANSFER: 'Chuyển khoản' };
const fmt = (p) => p ? new Intl.NumberFormat('vi-VN').format(p) + ' ₫' : '-';
const fmtDate = (d) => d ? new Date(d).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';

function calcDuration(checkIn, checkOut) {
  if (!checkIn || !checkOut) return '';
  const h = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60);
  if (h >= 24) return `${(h / 24).toFixed(1)} ngày`;
  return `${(Math.ceil(h * 2) / 2).toFixed(1)} giờ`;
}

function timeUntil(dateStr) {
  const diff = new Date(dateStr) - Date.now();
  if (diff <= 0) return { label: 'Đã quá giờ', over: true };
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (h >= 24) return { label: `Còn ${Math.floor(h / 24)} ngày ${h % 24}h`, over: false };
  return { label: `Còn ${h}h ${m}p`, over: false };
}

// Modal check-out: xác nhận thanh toán và tạo invoice
function CheckOutModal({ booking, onClose, onSuccess }) {
  const [payMethod, setPayMethod] = useState('CASH');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCheckOut = async () => {
    setSaving(true);
    try {
      // 1. Tạo invoice
      await invoiceApi.createInvoice({
        bookingId: booking.id,
        roomAmount: booking.totalPrice,
        serviceAmount: 0,
        totalPrice: booking.totalPrice,
        payMethod,
        status: 'PAID',
        note,
      });
      // 2. Cập nhật trạng thái booking
      await bookingApi.updateBookingStatus(booking.id, 'CHECKED_OUT');
      toast.success('Check-out thành công! Hóa đơn đã được tạo.');
      onSuccess();
    } catch (e) {
      toast.error(typeof e === 'string' ? e : 'Check-out thất bại');
    } finally { setSaving(false); }
  };

  return (
    <Modal open onClose={onClose} title={`Check-out — Phòng ${booking.roomNumber}`} size="md">
      <div className="space-y-4">
        {/* Tóm tắt booking */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Khách hàng</span>
            <span className="font-medium text-gray-900">{booking.userName}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Check-in</span>
            <span>{fmtDate(booking.checkInAt)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Check-out</span>
            <span>{fmtDate(booking.checkOutAt)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Thời gian lưu trú</span>
            <span>{calcDuration(booking.checkInAt, booking.checkOutAt)}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200 text-base">
            <span>Tổng thanh toán</span>
            <span className="text-primary-500">{fmt(booking.totalPrice)}</span>
          </div>
        </div>

        {/* Phương thức thanh toán */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phương thức thanh toán</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(PAY_METHODS).map(([k, v]) => (
              <button key={k} onClick={() => setPayMethod(k)}
                className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-colors ${
                  payMethod === k
                    ? 'border-primary-500 bg-primary-50 text-primary-600'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>
                {v}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Ghi chú (tùy chọn)</label>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
            className="input-field resize-none" placeholder="Ghi chú hóa đơn..." />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={onClose} className="btn-ghost flex-1">Hủy</button>
        <button onClick={handleCheckOut} disabled={saving}
          className="flex-1 py-2.5 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 disabled:opacity-50 transition-colors">
          {saving ? 'Đang xử lý...' : `Xác nhận thanh toán ${fmt(booking.totalPrice)}`}
        </button>
      </div>
    </Modal>
  );
}

export default function BookingsPage() {
  const user = authApi.getCurrentUser();
  const isReceptionist = user?.role === 'RECEPTIONIST';

  const [rows, setRows] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(isReceptionist ? 'PENDING' : '');
  const [modal, setModal] = useState({ open: false, mode: 'add', data: null });
  const [checkOutModal, setCheckOutModal] = useState(null); // booking object
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const load = () => {
    setLoading(true);
    Promise.all([bookingApi.getBookings(), roomApi.getRooms()])
      .then(([b, r]) => { setRows(b?.data || []); setRooms(r?.data || []); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = tab ? rows.filter(r => r.status === tab) : rows;
  const pendingCount = rows.filter(r => r.status === 'PENDING').length;
  const confirmedCount = rows.filter(r => r.status === 'CONFIRMED').length;
  const checkedInCount = rows.filter(r => r.status === 'CHECKED_IN').length;

  const openAdd = () => { setForm(EMPTY); setErr(''); setModal({ open: true, mode: 'add' }); };
  const openEdit = (b) => {
    setForm({ userId: b.userId, roomId: b.roomId, checkInAt: b.checkInAt?.slice(0, 16) || '', checkOutAt: b.checkOutAt?.slice(0, 16) || '', roomPrice: b.roomPrice, totalPrice: b.totalPrice, status: b.status, note: b.note || '' });
    setErr(''); setModal({ open: true, mode: 'edit', data: b });
  };

  const save = async () => {
    if (!form.userId || !form.roomId || !form.checkInAt || !form.checkOutAt) { setErr('Vui lòng điền đầy đủ thông tin bắt buộc'); return; }
    setSaving(true); setErr('');
    try {
      const p = { ...form, userId: +form.userId, roomId: +form.roomId, roomPrice: +form.roomPrice, totalPrice: +form.totalPrice };
      if (modal.mode === 'add') await bookingApi.createBooking(p);
      else await bookingApi.updateBooking(modal.data.id, p);
      setModal({ open: false }); load(); toast.success('Lưu thành công');
    } catch (e) { setErr(typeof e === 'string' ? e : 'Lưu thất bại'); }
    finally { setSaving(false); }
  };

  const changeStatus = async (id, status, successMsg) => {
    try {
      await bookingApi.updateBookingStatus(id, status);
      load();
      toast.success(successMsg || 'Cập nhật trạng thái thành công');
    } catch (e) { toast.error(typeof e === 'string' ? e : 'Cập nhật thất bại'); }
  };

  const del = async () => {
    try { await bookingApi.deleteBooking(confirm.id); load(); toast.success('Đã xóa đặt phòng'); }
    catch (e) { toast.error(typeof e === 'string' ? e : 'Xóa thất bại'); }
    finally { setConfirm({ open: false, id: null }); }
  };

  const TABS = isReceptionist
    ? [
        { key: 'PENDING', label: 'Chờ duyệt', count: pendingCount },
        { key: 'CONFIRMED', label: 'Sắp đến', count: confirmedCount },
        { key: 'CHECKED_IN', label: 'Đang ở', count: checkedInCount },
        { key: 'CHECKED_OUT', label: 'Đã trả phòng' },
        { key: 'CANCELLED', label: 'Đã hủy' },
        { key: '', label: 'Tất cả' },
      ]
    : [
        { key: '', label: 'Tất cả' },
        ...Object.entries(SL).map(([k, v]) => ({ key: k, label: v })),
      ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Quản lý đặt phòng</h1>
          <p className="text-sm text-gray-500 mt-0.5">{rows.length} đặt phòng</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Tạo đặt phòng
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t.label}
            {t.count > 0 && (
              <span className={`text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold ${
                t.key === 'PENDING' ? 'bg-red-500' : t.key === 'CONFIRMED' ? 'bg-blue-500' : 'bg-green-500'
              }`}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* === PENDING: duyệt đơn === */}
      {isReceptionist && tab === 'PENDING' && (
        filtered.length === 0
          ? <div className="card py-16 text-center text-gray-400 text-sm">Không có đơn chờ duyệt</div>
          : <div className="space-y-3">
              {filtered.map(b => (
                <div key={b.id} className="bg-white rounded-xl border border-yellow-200 shadow-sm p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-gray-900">#{b.id} — Phòng {b.roomNumber}</span>
                        <span className="badge-warning text-xs">Chờ duyệt</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                        <div><span className="text-gray-400 text-xs block">Khách hàng</span>{b.userName || `User #${b.userId}`}</div>
                        <div><span className="text-gray-400 text-xs block">Nhận phòng</span>{fmtDate(b.checkInAt)}</div>
                        <div><span className="text-gray-400 text-xs block">Trả phòng</span>{fmtDate(b.checkOutAt)}</div>
                        <div>
                          <span className="text-gray-400 text-xs block">Thời gian · Tổng tiền</span>
                          <span className="text-xs text-gray-500">{calcDuration(b.checkInAt, b.checkOutAt)} · </span>
                          <span className="font-semibold text-gray-900">{fmt(b.totalPrice)}</span>
                        </div>
                      </div>
                      {b.note && <p className="mt-2 text-xs text-gray-500 italic">Ghi chú: {b.note}</p>}
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button onClick={() => changeStatus(b.id, 'CONFIRMED', 'Đã duyệt đặt phòng')}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                        Duyệt
                      </button>
                      <button onClick={() => changeStatus(b.id, 'CANCELLED', 'Đã từ chối đặt phòng')}
                        className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                        Từ chối
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
      )}

      {/* === CONFIRMED: sắp đến, nút check-in === */}
      {isReceptionist && tab === 'CONFIRMED' && (
        filtered.length === 0
          ? <div className="card py-16 text-center text-gray-400 text-sm">Không có khách sắp đến</div>
          : <div className="space-y-3">
              {filtered.map(b => {
                const until = timeUntil(b.checkInAt);
                return (
                  <div key={b.id} className={`bg-white rounded-xl border shadow-sm p-4 ${until.over ? 'border-green-300' : 'border-blue-200'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="font-bold text-gray-900">#{b.id} — Phòng {b.roomNumber}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${until.over ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {until.label}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                          <div><span className="text-gray-400 text-xs block">Khách hàng</span>{b.userName || `User #${b.userId}`}</div>
                          <div><span className="text-gray-400 text-xs block">Check-in dự kiến</span>{fmtDate(b.checkInAt)}</div>
                          <div><span className="text-gray-400 text-xs block">Check-out dự kiến</span>{fmtDate(b.checkOutAt)}</div>
                          <div><span className="text-gray-400 text-xs block">Tổng tiền</span><span className="font-semibold text-gray-900">{fmt(b.totalPrice)}</span></div>
                        </div>
                        {b.note && <p className="mt-2 text-xs text-gray-500 italic">Ghi chú: {b.note}</p>}
                      </div>
                      <button onClick={() => changeStatus(b.id, 'CHECKED_IN', `Đã check-in phòng ${b.roomNumber}`)}
                        className="flex-shrink-0 px-5 py-2.5 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
                        Check-in
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
      )}

      {/* === CHECKED_IN: đang ở, nút check-out === */}
      {isReceptionist && tab === 'CHECKED_IN' && (
        filtered.length === 0
          ? <div className="card py-16 text-center text-gray-400 text-sm">Không có khách đang ở</div>
          : <div className="space-y-3">
              {filtered.map(b => {
                const until = timeUntil(b.checkOutAt);
                return (
                  <div key={b.id} className={`bg-white rounded-xl border shadow-sm p-4 ${until.over ? 'border-red-300' : 'border-green-200'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="font-bold text-gray-900">#{b.id} — Phòng {b.roomNumber}</span>
                          <span className="badge-success text-xs">Đang ở</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${until.over ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                            Check-out: {until.label}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                          <div><span className="text-gray-400 text-xs block">Khách hàng</span>{b.userName || `User #${b.userId}`}</div>
                          <div><span className="text-gray-400 text-xs block">Check-in lúc</span>{fmtDate(b.checkInAt)}</div>
                          <div><span className="text-gray-400 text-xs block">Check-out lúc</span>{fmtDate(b.checkOutAt)}</div>
                          <div><span className="text-gray-400 text-xs block">Tổng tiền</span><span className="font-semibold text-primary-500">{fmt(b.totalPrice)}</span></div>
                        </div>
                        {b.note && <p className="mt-2 text-xs text-gray-500 italic">Ghi chú: {b.note}</p>}
                      </div>
                      <button onClick={() => setCheckOutModal(b)}
                        className="flex-shrink-0 px-5 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                        Check-out
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
      )}

      {/* === Table: các tab còn lại === */}
      {(!isReceptionist || (tab !== 'PENDING' && tab !== 'CONFIRMED' && tab !== 'CHECKED_IN')) && (
        <div className="card overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-gray-400 text-sm">Đang tải...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">Không có dữ liệu</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>{['ID', 'Khách hàng', 'Phòng', 'Check-in', 'Check-out', 'Tổng tiền', 'Trạng thái', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">#{b.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{b.userName || `User #${b.userId}`}</td>
                      <td className="px-4 py-3 text-gray-600">{b.roomNumber || `Room #${b.roomId}`}</td>
                      <td className="px-4 py-3 text-gray-600">{fmtDate(b.checkInAt)}</td>
                      <td className="px-4 py-3 text-gray-600">{fmtDate(b.checkOutAt)}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{fmt(b.totalPrice)}</td>
                      <td className="px-4 py-3">
                        {isReceptionist ? (
                          <span className={`${SB[b.status] || 'badge-gray'} text-xs`}>{SL[b.status] || b.status}</span>
                        ) : (
                          <select value={b.status} onChange={e => changeStatus(b.id, e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white">
                            {Object.entries(SL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                          </select>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => openEdit(b)} className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                          </button>
                          <button onClick={() => setConfirm({ open: true, id: b.id })} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal tạo/sửa booking */}
      <Modal open={modal.open} onClose={() => setModal({ open: false })} title={modal.mode === 'add' ? 'Tạo đặt phòng' : 'Chỉnh sửa đặt phòng'} size="lg">
        {err && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{err}</div>}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">ID Khách hàng <span className="text-red-500">*</span></label>
              <input type="number" value={form.userId} onChange={e => setForm(p => ({ ...p, userId: e.target.value }))} placeholder="1" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phòng <span className="text-red-500">*</span></label>
              <select value={form.roomId} onChange={e => setForm(p => ({ ...p, roomId: e.target.value }))} className="input-field">
                <option value="">Chọn phòng</option>
                {rooms.filter(r => r.status === 'AVAILABLE').map(r => (
                  <option key={r.id} value={r.id}>{r.roomNumber} — {new Intl.NumberFormat('vi-VN').format(r.price)}₫</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Check-in <span className="text-red-500">*</span></label>
              <input type="datetime-local" value={form.checkInAt} onChange={e => setForm(p => ({ ...p, checkInAt: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Check-out <span className="text-red-500">*</span></label>
              <input type="datetime-local" value={form.checkOutAt} onChange={e => setForm(p => ({ ...p, checkOutAt: e.target.value }))} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Giá phòng (₫)</label>
              <input type="number" value={form.roomPrice} onChange={e => setForm(p => ({ ...p, roomPrice: e.target.value }))} placeholder="0" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tổng tiền (₫)</label>
              <input type="number" value={form.totalPrice} onChange={e => setForm(p => ({ ...p, totalPrice: e.target.value }))} placeholder="0" className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Trạng thái</label>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="input-field">
              {Object.entries(SL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ghi chú</label>
            <textarea value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} rows={2} className="input-field resize-none" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setModal({ open: false })} className="btn-ghost flex-1">Hủy</button>
          <button onClick={save} disabled={saving} className="btn-primary flex-1">{saving ? 'Đang lưu...' : 'Lưu'}</button>
        </div>
      </Modal>

      {/* Modal check-out */}
      {checkOutModal && (
        <CheckOutModal
          booking={checkOutModal}
          onClose={() => setCheckOutModal(null)}
          onSuccess={() => { setCheckOutModal(null); load(); }}
        />
      )}

      <ConfirmDialog open={confirm.open} title="Xóa đặt phòng" message="Bạn có chắc chắn muốn xóa đặt phòng này?"
        onConfirm={del} onCancel={() => setConfirm({ open: false, id: null })} />
    </div>
  );
}
