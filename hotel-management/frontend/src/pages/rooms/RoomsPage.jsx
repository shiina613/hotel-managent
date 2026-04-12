import { useState, useEffect, useRef } from 'react';
import roomApi from '../../api/roomApi';
import roomTypeApi from '../../api/roomTypeApi';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { toast } from '../../components/ui/Toast';

const SL = { AVAILABLE: 'Trống', OCCUPIED: 'Đang ở', MAINTENANCE: 'Bảo trì' };
const SB = { AVAILABLE: 'badge-success', OCCUPIED: 'badge-info', MAINTENANCE: 'badge-warning' };
const EMPTY = { roomNumber: '', roomTypeId: '', status: 'AVAILABLE', capacity: '', price: '', hourlyPrice: '', description: '', imgFolder: '' };

// Parse imgFolder JSON array
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

function ImageManager({ roomId, imgFolder, onUpdated }) {
  const { thumb, gallery } = parseImages(imgFolder);
  const thumbRef = useRef();
  const galleryRef = useRef();
  const [uploadingCount, setUploadingCount] = useState(0);

  const upload = async (file, isThumb) => {
    if (!file) return;
    setUploadingCount(c => c + 1);
    try {
      const res = await roomApi.uploadImage(roomId, file, isThumb);
      onUpdated(res?.data?.imgFolder);
      toast.success(isThumb ? 'Đã cập nhật ảnh thumbnail' : 'Đã thêm ảnh');
    } catch (e) { toast.error(typeof e === 'string' ? e : 'Upload thất bại'); }
    finally { setUploadingCount(c => c - 1); }
  };

  const uploadMultiple = async (files) => {
    // Upload tuần tự để tránh race condition
    for (const file of files) {
      await upload(file, false);
    }
  };

  const remove = async (url) => {
    try {
      const res = await roomApi.deleteImage(roomId, url);
      onUpdated(res?.data?.imgFolder);
      toast.success('Đã xóa ảnh');
    } catch (e) { toast.error(typeof e === 'string' ? e : 'Xóa thất bại'); }
  };

  const isUploading = uploadingCount > 0;
  const BASE = ''; // Vite proxy

  return (
    <div className="space-y-5">
      {/* Thumbnail */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">Ảnh thumbnail</p>
          <button onClick={() => thumbRef.current?.click()} disabled={isUploading}
            className="text-xs text-primary-500 hover:text-primary-600 font-medium disabled:opacity-50">
            {thumb ? 'Thay ảnh' : '+ Chọn ảnh'}
          </button>
          <input ref={thumbRef} type="file" accept="image/*" className="hidden"
            onChange={e => { upload(e.target.files[0], true); e.target.value = ''; }} />
        </div>
        {thumb ? (
          <div className="relative group rounded-xl overflow-hidden border border-gray-200 h-40">
            <img src={BASE + thumb} alt="thumb" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button onClick={() => thumbRef.current?.click()} disabled={isUploading}
                className="px-3 py-1.5 bg-white text-gray-800 rounded-lg text-xs font-medium hover:bg-gray-100 disabled:opacity-50">
                Thay ảnh
              </button>
              <button onClick={() => remove('thumb:' + thumb)} disabled={isUploading}
                className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 disabled:opacity-50">
                Xóa
              </button>
            </div>
            <span className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">Thumbnail</span>
          </div>
        ) : (
          <button onClick={() => thumbRef.current?.click()} disabled={isUploading}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary-400 hover:bg-primary-50 transition-colors disabled:opacity-50">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span className="text-sm text-gray-400">Chọn ảnh thumbnail</span>
          </button>
        )}
      </div>

      {/* Gallery */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">Ảnh mô tả ({gallery.length})</p>
          <button onClick={() => galleryRef.current?.click()} disabled={isUploading}
            className="text-xs text-primary-500 hover:text-primary-600 font-medium disabled:opacity-50">
            + Thêm ảnh
          </button>
          <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden"
            onChange={e => {
              const files = Array.from(e.target.files);
              e.target.value = '';
              uploadMultiple(files);
            }} />
        </div>
        {gallery.length === 0 ? (
          <button onClick={() => galleryRef.current?.click()} disabled={isUploading}
            className="w-full h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center gap-2 hover:border-primary-300 hover:bg-primary-50 transition-colors disabled:opacity-50">
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            <span className="text-sm text-gray-400">Nhấn để thêm ảnh mô tả phòng</span>
          </button>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {gallery.map((url, i) => (
              <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square">
                <img src={BASE + url} alt={`gallery-${i}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => remove(url)} disabled={isUploading}
                    className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            {/* Nút thêm ảnh cuối grid */}
            <button onClick={() => galleryRef.current?.click()} disabled={isUploading}
              className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-primary-300 hover:bg-primary-50 transition-colors disabled:opacity-50">
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
              <span className="text-xs text-gray-400">Thêm</span>
            </button>
          </div>
        )}
      </div>

      {isUploading && (
        <p className="text-xs text-primary-500 text-center animate-pulse">
          Đang tải ảnh lên{uploadingCount > 1 ? ` (${uploadingCount} ảnh)` : ''}...
        </p>
      )}
    </div>
  );
}

export default function RoomsPage() {
  const [rows, setRows] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modal, setModal] = useState({ open: false, mode: 'add', data: null });
  const [form, setForm] = useState(EMPTY);
  const [tab, setTab] = useState('info'); // 'info' | 'images'
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [currentImgFolder, setCurrentImgFolder] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([roomApi.getRooms(), roomTypeApi.getRoomTypes()])
      .then(([r, t]) => { setRows(r?.data || []); setTypes(t?.data || []); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = rows.filter(r => {
    const ms = !search || r.roomNumber?.toLowerCase().includes(search.toLowerCase()) || r.description?.toLowerCase().includes(search.toLowerCase());
    const mf = !filterStatus || r.status === filterStatus;
    return ms && mf;
  });

  const openAdd = () => {
    setForm(EMPTY); setErr(''); setTab('info');
    setModal({ open: true, mode: 'add' });
  };
  const openEdit = (r) => {
    setForm({ roomNumber: r.roomNumber, roomTypeId: r.roomTypeId, status: r.status, capacity: r.capacity, price: r.price, hourlyPrice: r.hourlyPrice || '', description: r.description || '', imgFolder: r.imgFolder || '' });
    setCurrentImgFolder(r.imgFolder || '');
    setErr(''); setTab('info');
    setModal({ open: true, mode: 'edit', data: r });
  };

  const save = async () => {
    if (!form.roomNumber || !form.roomTypeId || !form.capacity || !form.price) { setErr('Vui lòng điền đầy đủ thông tin bắt buộc'); return; }
    setSaving(true); setErr('');
    try {
      const p = { ...form, roomTypeId: +form.roomTypeId, capacity: +form.capacity, price: +form.price, hourlyPrice: form.hourlyPrice ? +form.hourlyPrice : null };
      if (modal.mode === 'add') {
        const res = await roomApi.createRoom(p);
        // Switch to image tab after creating
        setModal(prev => ({ ...prev, mode: 'edit', data: res?.data }));
        setCurrentImgFolder('');
        setTab('images');
        toast.success('Tạo phòng thành công — hãy thêm ảnh cho phòng');
      } else {
        await roomApi.updateRoom(modal.data.id, p);
        setModal({ open: false }); toast.success('Lưu thành công');
      }
      load();
    } catch (e) { setErr(typeof e === 'string' ? e : 'Lưu thất bại'); }
    finally { setSaving(false); }
  };

  const del = async () => {
    try { await roomApi.deleteRoom(confirm.id); load(); toast.success('Đã xóa phòng'); }
    catch (e) { toast.error(typeof e === 'string' ? e : 'Xóa thất bại'); }
    finally { setConfirm({ open: false, id: null }); }
  };

  const fmt = (p) => new Intl.NumberFormat('vi-VN').format(p) + ' ₫';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Quản lý phòng</h1>
          <p className="text-sm text-gray-500 mt-0.5">{rows.length} phòng</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Thêm phòng
        </button>
      </div>

      <div className="card p-4 mb-4 flex flex-wrap gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm phòng..."
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
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
                  <tr>{['Ảnh','Số phòng','Loại phòng','Sức chứa','Giá/đêm','Giá/giờ','Trạng thái',''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(r => {
                    const { thumb: t } = parseImages(r.imgFolder);
                    return (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          {t ? (
                            <img src={'http://localhost:8080' + t} alt={r.roomNumber}
                              className="w-12 h-10 object-cover rounded-lg border border-gray-100" />
                          ) : (
                            <div className="w-12 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                              </svg>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">{r.roomNumber}</td>
                        <td className="px-4 py-3 text-gray-600">{r.roomTypeName || '-'}</td>
                        <td className="px-4 py-3 text-gray-600">{r.capacity} khách</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{fmt(r.price)}</td>
                        <td className="px-4 py-3 text-gray-600">{r.hourlyPrice ? fmt(r.hourlyPrice) : <span className="text-gray-300">—</span>}</td>
                        <td className="px-4 py-3"><span className={SB[r.status] || 'badge-gray'}>{SL[r.status] || r.status}</span></td>
                        <td className="px-4 py-3">
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        }
      </div>

      {/* Modal */}
      <Modal open={modal.open} onClose={() => { setModal({ open: false }); load(); }}
        title={modal.mode === 'add' ? 'Thêm phòng mới' : `Phòng ${modal.data?.roomNumber || ''}`}
        size="lg">

        {/* Tabs — chỉ hiện khi edit */}
        {modal.mode === 'edit' && (
          <div className="flex border-b border-gray-100 mb-5 -mt-1">
            {[['info','Thông tin'],['images','Hình ảnh']].map(([k,l]) => (
              <button key={k} onClick={() => setTab(k)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === k ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {l}
              </button>
            ))}
          </div>
        )}

        {tab === 'info' && (
          <>
            {err && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{err}</div>}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Số phòng <span className="text-red-500">*</span></label>
                  <input value={form.roomNumber} onChange={e => setForm(p => ({...p, roomNumber: e.target.value}))} placeholder="101" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Loại phòng <span className="text-red-500">*</span></label>
                  <select value={form.roomTypeId} onChange={e => setForm(p => ({...p, roomTypeId: e.target.value}))} className="input-field">
                    <option value="">Chọn loại phòng</option>
                    {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sức chứa <span className="text-red-500">*</span></label>
                  <input type="number" value={form.capacity} onChange={e => setForm(p => ({...p, capacity: e.target.value}))} placeholder="2" min="1" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Trạng thái</label>
                  <select value={form.status} onChange={e => setForm(p => ({...p, status: e.target.value}))} className="input-field">
                    {Object.entries(SL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Giá theo đêm (₫) <span className="text-red-500">*</span></label>
                  <input type="number" value={form.price} onChange={e => setForm(p => ({...p, price: e.target.value}))} placeholder="500000" min="0" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Giá theo giờ (₫)</label>
                  <input type="number" value={form.hourlyPrice} onChange={e => setForm(p => ({...p, hourlyPrice: e.target.value}))} placeholder="Để trống = tự tính" min="0" className="input-field" />
                  {form.price && !form.hourlyPrice && (
                    <p className="text-xs text-gray-400 mt-1">Mặc định: {new Intl.NumberFormat('vi-VN').format(Math.round(+form.price / 24))} ₫/giờ</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
                <textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} rows={3} className="input-field resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setModal({ open: false }); load(); }} className="btn-ghost flex-1">Hủy</button>
              <button onClick={save} disabled={saving} className="btn-primary flex-1">{saving ? 'Đang lưu...' : modal.mode === 'add' ? 'Tạo & thêm ảnh →' : 'Lưu'}</button>
            </div>
          </>
        )}

        {tab === 'images' && modal.mode === 'edit' && (
          <>
            <ImageManager
              roomId={modal.data?.id}
              imgFolder={currentImgFolder}
              onUpdated={(newImgFolder) => {
                setCurrentImgFolder(newImgFolder || '');
                // Update row in table
                setRows(prev => prev.map(r => r.id === modal.data?.id ? { ...r, imgFolder: newImgFolder } : r));
              }}
            />
            <div className="mt-6">
              <button onClick={() => { setModal({ open: false }); load(); }} className="btn-primary w-full">Xong</button>
            </div>
          </>
        )}
      </Modal>

      <ConfirmDialog open={confirm.open} title="Xóa phòng" message="Bạn có chắc chắn muốn xóa phòng này?"
        onConfirm={del} onCancel={() => setConfirm({ open: false, id: null })} />
    </div>
  );
}
