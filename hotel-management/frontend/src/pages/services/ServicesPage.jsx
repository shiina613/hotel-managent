import { useState, useEffect } from 'react';
import serviceApi from '../../api/serviceApi';
import axiosClient from '../../api/axiosClient';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { toast } from '../../components/ui/Toast';

// Đơn vị mặc định — có thể thêm tự do
const DEFAULT_UNITS = ['Cái/Lần', 'Giờ', 'Ngày', 'Đêm', 'Người', 'Chai', 'Đĩa', 'Bộ'];

export default function ServicesPage() {
  const [rows, setRows] = useState([]);
  const [units, setUnits] = useState(DEFAULT_UNITS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState({ open: false, mode: 'add', data: null });
  const [form, setForm] = useState({ name: '', price: '', unit: 'Cái/Lần', customUnit: '', isActive: true });
  const [useCustomUnit, setUseCustomUnit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const load = () => {
    setLoading(true);
    serviceApi.getServices().then(r => setRows(r?.data || [])).finally(() => setLoading(false));
    // Load existing units from DB
    axiosClient.get('/services/units').then(r => {
      const dbUnits = r?.data || [];
      const merged = [...new Set([...DEFAULT_UNITS, ...dbUnits])];
      setUnits(merged);
    }).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const filtered = rows.filter(r => !search || r.name?.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => {
    setForm({ name: '', price: '', unit: 'Cái/Lần', customUnit: '', isActive: true });
    setUseCustomUnit(false); setErr('');
    setModal({ open: true, mode: 'add' });
  };
  const openEdit = (r) => {
    const isCustom = !DEFAULT_UNITS.includes(r.unit);
    setForm({ name: r.name, price: r.price, unit: isCustom ? '' : r.unit, customUnit: isCustom ? r.unit : '', isActive: r.isActive });
    setUseCustomUnit(isCustom); setErr('');
    setModal({ open: true, mode: 'edit', data: r });
  };

  const getUnit = () => useCustomUnit ? form.customUnit.trim() : form.unit;

  const save = async () => {
    const unit = getUnit();
    if (!form.name || !form.price || !unit) { setErr('Vui lòng điền đầy đủ thông tin bắt buộc'); return; }
    setSaving(true); setErr('');
    try {
      const p = { name: form.name, price: +form.price, unit, isActive: form.isActive };
      if (modal.mode === 'add') await serviceApi.createService(p);
      else await serviceApi.updateService(modal.data.id, p);
      setModal({ open: false }); load(); toast.success('Lưu thành công');
    } catch (e) { setErr(typeof e === 'string' ? e : 'Lưu thất bại'); }
    finally { setSaving(false); }
  };

  const del = async () => {
    try { await serviceApi.deleteService(confirm.id); load(); toast.success('Đã xóa dịch vụ'); }
    catch (e) { toast.error(typeof e === 'string' ? e : 'Xóa thất bại'); }
    finally { setConfirm({ open: false, id: null }); }
  };

  const fmt = (p) => new Intl.NumberFormat('vi-VN').format(p) + ' ₫';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Quản lý dịch vụ</h1>
          <p className="text-sm text-gray-500 mt-0.5">{rows.length} dịch vụ</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          Thêm dịch vụ
        </button>
      </div>

      <div className="card p-4 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm dịch vụ..."
          className="w-full max-w-sm px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>

      <div className="card overflow-hidden">
        {loading ? <div className="py-16 text-center text-gray-400 text-sm">Đang tải...</div>
          : filtered.length === 0 ? <div className="py-16 text-center text-gray-400 text-sm">Không có dữ liệu</div>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>{['Tên dịch vụ','Giá','Đơn vị','Trạng thái',''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">{r.name}</td>
                      <td className="px-5 py-3 font-medium text-gray-900">{fmt(r.price)}</td>
                      <td className="px-5 py-3 text-gray-600">{r.unit}</td>
                      <td className="px-5 py-3">
                        <span className={r.isActive ? 'badge-success' : 'badge-danger'}>
                          {r.isActive ? 'Hoạt động' : 'Tạm dừng'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => openEdit(r)} className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                          </button>
                          <button onClick={() => setConfirm({ open: true, id: r.id })} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
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

      <Modal open={modal.open} onClose={() => setModal({ open: false })}
        title={modal.mode === 'add' ? 'Thêm dịch vụ' : 'Chỉnh sửa dịch vụ'} size="sm">
        {err && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{err}</div>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên dịch vụ <span className="text-red-500">*</span></label>
            <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))}
              placeholder="Spa, Hồ bơi..." className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Giá (₫) <span className="text-red-500">*</span></label>
            <input type="number" value={form.price} onChange={e => setForm(p => ({...p, price: e.target.value}))}
              placeholder="0" min="0" className="input-field" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-700">Đơn vị <span className="text-red-500">*</span></label>
              <button type="button" onClick={() => setUseCustomUnit(p => !p)}
                className="text-xs text-primary-500 hover:text-primary-600 font-medium">
                {useCustomUnit ? '← Chọn từ danh sách' : '+ Nhập đơn vị mới'}
              </button>
            </div>
            {useCustomUnit ? (
              <input value={form.customUnit} onChange={e => setForm(p => ({...p, customUnit: e.target.value}))}
                placeholder="Nhập đơn vị tùy chỉnh..." className="input-field" autoFocus />
            ) : (
              <select value={form.unit} onChange={e => setForm(p => ({...p, unit: e.target.value}))} className="input-field">
                {units.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            )}
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({...p, isActive: e.target.checked}))}
              className="w-4 h-4 text-primary-500 rounded border-gray-300 focus:ring-primary-500" />
            <span className="text-sm font-medium text-gray-700">Đang hoạt động</span>
          </label>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setModal({ open: false })} className="btn-ghost flex-1">Hủy</button>
          <button onClick={save} disabled={saving} className="btn-primary flex-1">{saving ? 'Đang lưu...' : 'Lưu'}</button>
        </div>
      </Modal>

      <ConfirmDialog open={confirm.open} title="Xóa dịch vụ" message="Bạn có chắc chắn muốn xóa dịch vụ này?"
        onConfirm={del} onCancel={() => setConfirm({ open: false, id: null })} />
    </div>
  );
}
