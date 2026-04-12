import { useState, useEffect } from 'react';
import roomTypeApi from '../../api/roomTypeApi';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { toast } from '../../components/ui/Toast';

export default function RoomTypesPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState({ open: false, mode: 'add', data: null });
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const load = () => { setLoading(true); roomTypeApi.getRoomTypes().then(r => setRows(r?.data || [])).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const filtered = rows.filter(r => !search || r.name?.toLowerCase().includes(search.toLowerCase()));
  const openAdd = () => { setForm({ name: '', description: '' }); setErr(''); setModal({ open: true, mode: 'add' }); };
  const openEdit = (r) => { setForm({ name: r.name, description: r.description || '' }); setErr(''); setModal({ open: true, mode: 'edit', data: r }); };

  const save = async () => {
    if (!form.name.trim()) { setErr('Tên loại phòng là bắt buộc'); return; }
    setSaving(true); setErr('');
    try {
      if (modal.mode === 'add') await roomTypeApi.createRoomType(form);
      else await roomTypeApi.updateRoomType(modal.data.id, form);
      setModal({ open: false }); load(); toast.success('Lưu thành công');
    } catch (e) { setErr(typeof e === 'string' ? e : 'Lưu thất bại'); }
    finally { setSaving(false); }
  };

  const del = async () => {
    try { await roomTypeApi.deleteRoomType(confirm.id); load(); toast.success('Đã xóa loại phòng'); }
    catch (e) { toast.error(typeof e === 'string' ? e : 'Xóa thất bại'); }
    finally { setConfirm({ open: false, id: null }); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Loại phòng</h1>
          <p className="text-sm text-gray-500 mt-0.5">{rows.length} loại phòng</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Thêm loại phòng
        </button>
      </div>

      <div className="card p-4 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm loại phòng..."
          className="w-full max-w-sm px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>

      <div className="card overflow-hidden">
        {loading ? <div className="py-16 text-center text-gray-400 text-sm">Đang tải...</div>
          : filtered.length === 0 ? <div className="py-16 text-center text-gray-400 text-sm">Không có dữ liệu</div>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>{['ID','Tên loại phòng','Mô tả','Ngày tạo',''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 text-gray-500">#{r.id}</td>
                      <td className="px-5 py-3 font-medium text-gray-900">{r.name}</td>
                      <td className="px-5 py-3 text-gray-500 max-w-xs truncate">{r.description || '-'}</td>
                      <td className="px-5 py-3 text-gray-500">{r.createAt ? new Date(r.createAt).toLocaleDateString('vi-VN') : '-'}</td>
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

      <Modal open={modal.open} onClose={() => setModal({ open: false })} title={modal.mode === 'add' ? 'Thêm loại phòng' : 'Chỉnh sửa loại phòng'} size="sm">
        {err && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{err}</div>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên loại phòng <span className="text-red-500">*</span></label>
            <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="Deluxe, Superior..." className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
            <textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} rows={3} className="input-field resize-none" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setModal({ open: false })} className="btn-ghost flex-1">Hủy</button>
          <button onClick={save} disabled={saving} className="btn-primary flex-1">{saving ? 'Đang lưu...' : 'Lưu'}</button>
        </div>
      </Modal>

      <ConfirmDialog open={confirm.open} title="Xóa loại phòng" message="Bạn có chắc chắn muốn xóa loại phòng này?"
        onConfirm={del} onCancel={() => setConfirm({ open: false, id: null })} />
    </div>
  );
}
