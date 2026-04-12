import { useState, useEffect } from 'react';
import invoiceApi from '../../api/invoiceApi';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { toast } from '../../components/ui/Toast';

const SL = { UNPAID: 'Chưa thanh toán', PAID: 'Đã thanh toán', CANCELLED: 'Đã hủy' };
const SB = { UNPAID: 'badge-warning', PAID: 'badge-success', CANCELLED: 'badge-danger' };
const PAY = { CASH: 'Tiền mặt', CARD: 'Thẻ', TRANSFER: 'Chuyển khoản' };
const EMPTY = { bookingId: '', roomAmount: '', serviceAmount: '', totalPrice: '', payMethod: 'CASH', status: 'UNPAID', note: '' };

export default function InvoicesPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [modal, setModal] = useState({ open: false, mode: 'add', data: null });
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const load = () => { setLoading(true); invoiceApi.getInvoices().then(r => setRows(r?.data || [])).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const filtered = filterStatus ? rows.filter(r => r.status === filterStatus) : rows;
  const openAdd = () => { setForm(EMPTY); setErr(''); setModal({ open: true, mode: 'add' }); };
  const openEdit = (inv) => {
    setForm({ bookingId: inv.bookingId, roomAmount: inv.roomAmount, serviceAmount: inv.serviceAmount, totalPrice: inv.totalPrice, payMethod: inv.payMethod || 'CASH', status: inv.status, note: inv.note || '' });
    setErr(''); setModal({ open: true, mode: 'edit', data: inv });
  };

  const save = async () => {
    if (!form.bookingId || !form.totalPrice) { setErr('Vui lòng điền đầy đủ thông tin bắt buộc'); return; }
    setSaving(true); setErr('');
    try {
      const p = { ...form, bookingId: +form.bookingId, roomAmount: +form.roomAmount, serviceAmount: +form.serviceAmount, totalPrice: +form.totalPrice };
      if (modal.mode === 'add') await invoiceApi.createInvoice(p);
      else await invoiceApi.updateInvoice(modal.data.id, p);
      setModal({ open: false }); load(); toast.success('Lưu thành công');
    } catch (e) { setErr(typeof e === 'string' ? e : 'Lưu thất bại'); }
    finally { setSaving(false); }
  };

  const markPaid = async (id) => {
    try { await invoiceApi.markAsPaid(id, 'CASH'); load(); toast.success('Đã thanh toán thành công'); }
    catch (e) { toast.error(typeof e === 'string' ? e : 'Thất bại'); }
  };

  const del = async () => {
    try { await invoiceApi.deleteInvoice(confirm.id); load(); toast.success('Đã xóa hóa đơn'); }
    catch (e) { toast.error(typeof e === 'string' ? e : 'Xóa thất bại'); }
    finally { setConfirm({ open: false, id: null }); }
  };

  const fmt = (p) => p ? new Intl.NumberFormat('vi-VN').format(p) + ' ₫' : '-';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Quản lý hóa đơn</h1>
          <p className="text-sm text-gray-500 mt-0.5">{rows.length} hóa đơn</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Tạo hóa đơn
        </button>
      </div>

      <div className="card p-4 mb-4">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="">Tất cả trạng thái</option>
          {Object.entries(SL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        {loading ? <div className="py-16 text-center text-gray-400 text-sm">Đang tải...</div>
          : filtered.length === 0 ? <div className="py-16 text-center text-gray-400 text-sm">Không có dữ liệu</div>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>{['ID','Booking','Tiền phòng','Tiền DV','Tổng tiền','Thanh toán','Trạng thái',''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(inv => (
                    <tr key={inv.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">#{inv.id}</td>
                      <td className="px-4 py-3 text-gray-600">#{inv.bookingId}</td>
                      <td className="px-4 py-3 text-gray-600">{fmt(inv.roomAmount)}</td>
                      <td className="px-4 py-3 text-gray-600">{fmt(inv.serviceAmount)}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{fmt(inv.totalPrice)}</td>
                      <td className="px-4 py-3 text-gray-600">{PAY[inv.payMethod] || inv.payMethod || '-'}</td>
                      <td className="px-4 py-3"><span className={SB[inv.status] || 'badge-gray'}>{SL[inv.status] || inv.status}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          {inv.status === 'UNPAID' && (
                            <button onClick={() => markPaid(inv.id)} className="px-2 py-1 text-xs bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium">Thanh toán</button>
                          )}
                          <button onClick={() => openEdit(inv)} className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                          </button>
                          <button onClick={() => setConfirm({ open: true, id: inv.id })} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>

      <Modal open={modal.open} onClose={() => setModal({ open: false })} title={modal.mode === 'add' ? 'Tạo hóa đơn' : 'Chỉnh sửa hóa đơn'}>
        {err && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{err}</div>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">ID Đặt phòng <span className="text-red-500">*</span></label>
            <input type="number" value={form.bookingId} onChange={e => setForm(p => ({...p, bookingId: e.target.value}))} placeholder="1" className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiền phòng (₫)</label>
              <input type="number" value={form.roomAmount} onChange={e => setForm(p => ({...p, roomAmount: e.target.value}))} placeholder="0" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiền dịch vụ (₫)</label>
              <input type="number" value={form.serviceAmount} onChange={e => setForm(p => ({...p, serviceAmount: e.target.value}))} placeholder="0" className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tổng tiền (₫) <span className="text-red-500">*</span></label>
            <input type="number" value={form.totalPrice} onChange={e => setForm(p => ({...p, totalPrice: e.target.value}))} placeholder="0" className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phương thức thanh toán</label>
              <select value={form.payMethod} onChange={e => setForm(p => ({...p, payMethod: e.target.value}))} className="input-field">
                {Object.entries(PAY).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Trạng thái</label>
              <select value={form.status} onChange={e => setForm(p => ({...p, status: e.target.value}))} className="input-field">
                {Object.entries(SL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ghi chú</label>
            <textarea value={form.note} onChange={e => setForm(p => ({...p, note: e.target.value}))} rows={2} className="input-field resize-none" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setModal({ open: false })} className="btn-ghost flex-1">Hủy</button>
          <button onClick={save} disabled={saving} className="btn-primary flex-1">{saving ? 'Đang lưu...' : 'Lưu'}</button>
        </div>
      </Modal>

      <ConfirmDialog open={confirm.open} title="Xóa hóa đơn" message="Bạn có chắc chắn muốn xóa hóa đơn này?"
        onConfirm={del} onCancel={() => setConfirm({ open: false, id: null })} />
    </div>
  );
}
