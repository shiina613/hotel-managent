import { useState, useEffect } from 'react';
import userApi from '../../api/userApi';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { toast } from '../../components/ui/Toast';
import Pagination from '../../components/ui/Pagination';
import TableSkeleton from '../../components/ui/TableSkeleton';

const ROLES = { ADMIN: 'Admin', RECEPTIONIST: 'Lễ tân', CUSTOMER: 'Khách hàng' };
const ROLE_BADGE = { ADMIN: 'badge-danger', RECEPTIONIST: 'badge-primary', CUSTOMER: 'badge-info' };
const STATUSES = { ACTIVE: 'Hoạt động', INACTIVE: 'Không hoạt động', SUSPENDED: 'Bị khóa', DELETED: 'Đã xóa' };
const STATUS_BADGE = { ACTIVE: 'badge-success', INACTIVE: 'badge-gray', SUSPENDED: 'badge-warning', DELETED: 'badge-danger' };

const EMPTY_FORM = { username: '', password: '', fullName: '', email: '', phone: '', role: 'CUSTOMER', status: 'ACTIVE' };

export default function UsersPage() {
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 0, totalPages: 0, totalElements: 0, pageSize: 10 });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [modal, setModal] = useState({ open: false, mode: 'add', data: null });
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const load = (page = currentPage) => {
    setLoading(true);
    userApi.getUsers({ page, size: pageSize }).then(r => {
      const data = r?.data;
      // Handle both PageResponse and plain array
      if (data && typeof data === 'object' && 'content' in data) {
        setRows(data.content || []);
        setPagination({
          currentPage: data.currentPage ?? page,
          totalPages: data.totalPages ?? 1,
          totalElements: data.totalElements ?? 0,
          pageSize: data.pageSize ?? pageSize,
        });
      } else {
        setRows(Array.isArray(data) ? data : []);
        setPagination({ currentPage: 0, totalPages: 1, totalElements: Array.isArray(data) ? data.length : 0, pageSize });
      }
    }).finally(() => setLoading(false));
  };
  useEffect(() => { load(currentPage); }, [currentPage]);

  const filtered = rows.filter(r => {
    const ms = !search || r.username?.toLowerCase().includes(search.toLowerCase())
      || r.fullName?.toLowerCase().includes(search.toLowerCase())
      || r.email?.toLowerCase().includes(search.toLowerCase());
    const mr = !filterRole || r.role === filterRole;
    const mst = !filterStatus || r.status === filterStatus;
    return ms && mr && mst;
  });

  const openAdd = () => { setForm(EMPTY_FORM); setErr(''); setModal({ open: true, mode: 'add' }); };
  const openEdit = (u) => {
    setForm({ username: u.username, password: '', fullName: u.fullName, email: u.email, phone: u.phone || '', role: u.role, status: u.status });
    setErr(''); setModal({ open: true, mode: 'edit', data: u });
  };

  const save = async () => {
    if (!form.fullName || !form.email || !form.role) { setErr('Vui lòng điền đầy đủ thông tin bắt buộc'); return; }
    if (modal.mode === 'add' && (!form.username || !form.password)) { setErr('Username và mật khẩu là bắt buộc'); return; }
    setSaving(true); setErr('');
    try {
      if (modal.mode === 'add') {
        await userApi.createUser(form);
      } else {
        const payload = { fullName: form.fullName, email: form.email, phone: form.phone, role: form.role, status: form.status };
        await userApi.updateUser(modal.data.id, payload);
      }
      setModal({ open: false }); load(currentPage); toast.success('Lưu thành công');
    } catch (e) { setErr((e && typeof e === 'object' && e.message) ? e.message : (typeof e === 'string' ? e : 'Lưu thất bại')); }
    finally { setSaving(false); }
  };

  const del = async () => {
    try { await userApi.deleteUser(confirm.id); load(currentPage); toast.success('Đã xóa tài khoản'); }
    catch (e) { toast.error((e && typeof e === 'object' && e.message) ? e.message : (typeof e === 'string' ? e : 'Xóa thất bại')); }
    finally { setConfirm({ open: false, id: null }); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Quản lý tài khoản</h1>
          <p className="text-sm text-gray-500 mt-0.5">{pagination.totalElements} tài khoản</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          Thêm tài khoản
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-4 flex flex-wrap gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Tìm theo username, họ tên, email..."
          className="flex-1 min-w-[220px] px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
    <option value="">Tất cả vai trò</option>
          {Object.entries(ROLES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="">Tất cả trạng thái</option>
          {Object.entries(STATUSES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading
          ? <TableSkeleton rows={pageSize} cols={7} />
          : filtered.length === 0
            ? <div className="py-16 text-center text-gray-400 text-sm">Không có dữ liệu</div>
            : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['ID', 'Tài khoản', 'Họ tên', 'Email', 'Vai trò', 'Trạng thái', ''].map(h => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3 text-gray-400 text-xs">#{u.id}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-primary-600 text-xs font-semibold">{u.fullName?.charAt(0) || 'U'}</span>
                            </div>
                            <span className="font-medium text-gray-900">{u.username}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-gray-700">{u.fullName}</td>
                        <td className="px-5 py-3 text-gray-500">{u.email}</td>
                        <td className="px-5 py-3">
                          <span className={ROLE_BADGE[u.role] || 'badge-gray'}>{ROLES[u.role] || u.role}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={STATUS_BADGE[u.status] || 'badge-gray'}>{STATUSES[u.status] || u.status}</span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => openEdit(u)}
                              className="p-1.5 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                              </svg>
                            </button>
                            <button onClick={() => setConfirm({ open: true, id: u.id })}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                              </svg>
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

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalElements={pagination.totalElements}
        pageSize={pagination.pageSize}
        onPageChange={(p) => setCurrentPage(p)}
      />

      {/* Modal */}
      <Modal open={modal.open} onClose={() => setModal({ open: false })}
        title={modal.mode === 'add' ? 'Thêm tài khoản' : `Chỉnh sửa — ${modal.data?.username}`}>
        {err && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{err}</div>
        )}
        <div className="space-y-4">
          {modal.mode === 'add' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Username <span className="text-red-500">*</span></label>
                <input value={form.username} onChange={e => setForm(p => ({...p, username: e.target.value}))}
                  placeholder="username" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu <span className="text-red-500">*</span></label>
                <input type="password" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))}
                  placeholder="••••••" className="input-field" />
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ tên <span className="text-red-500">*</span></label>
              <input value={form.fullName} onChange={e => setForm(p => ({...p, fullName: e.target.value}))}
                placeholder="Nguyễn Văn A" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
              <input value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))}
                placeholder="0901234567" className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
            <input type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))}
              placeholder="email@example.com" className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Vai trò</label>
              <select value={form.role} onChange={e => setForm(p => ({...p, role: e.target.value}))} className="input-field">
                {Object.entries(ROLES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Trạng thái</label>
              <select value={form.status} onChange={e => setForm(p => ({...p, status: e.target.value}))} className="input-field">
                {Object.entries(STATUSES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setModal({ open: false })} className="btn-ghost flex-1">Hủy</button>
          <button onClick={save} disabled={saving} className="btn-primary flex-1">
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog open={confirm.open} title="Xóa tài khoản"
        message="Bạn có chắc chắn muốn xóa tài khoản này? Thao tác không thể hoàn tác."
        onConfirm={del} onCancel={() => setConfirm({ open: false, id: null })} />
    </div>
  );
}
