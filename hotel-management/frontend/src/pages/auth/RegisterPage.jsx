import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authApi from '../../api/authApi';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '', fullName: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(''); };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password || !form.fullName || !form.email) { setError('Vui lòng điền đầy đủ thông tin bắt buộc'); return; }
    if (form.password !== form.confirmPassword) { setError('Mật khẩu xác nhận không khớp'); return; }
    setLoading(true);
    try {
      await authApi.register({ username: form.username, password: form.password, fullName: form.fullName, email: form.email, phone: form.phone, role: 'CUSTOMER', status: 'ACTIVE' });
      navigate('/login');
    } catch (e) { setError(typeof e === 'string' ? e : 'Đăng ký thất bại'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-8"
      style={{ background: 'radial-gradient(ellipse at 60% 40%, #3324BC 0%, #1e1571 60%, #0f0a3d 100%)' }}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400 opacity-20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-12 bg-primary-500 rounded-xl mb-3">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Etheric Hotel</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tạo tài khoản</h2>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ tên <span className="text-red-500">*</span></label>
                <input name="fullName" value={form.fullName} onChange={onChange} placeholder="Nguyễn Văn A" className="input-field" disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
                <input name="phone" value={form.phone} onChange={onChange} placeholder="0901234567" className="input-field" disabled={loading} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
              <input name="email" type="email" value={form.email} onChange={onChange} placeholder="email@example.com" className="input-field" disabled={loading} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên đăng nhập <span className="text-red-500">*</span></label>
              <input name="username" value={form.username} onChange={onChange} placeholder="Tên đăng nhập" className="input-field" disabled={loading} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu <span className="text-red-500">*</span></label>
              <input name="password" type="password" value={form.password} onChange={onChange} placeholder="Tối thiểu 6 ký tự" className="input-field" disabled={loading} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu <span className="text-red-500">*</span></label>
              <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange} placeholder="Nhập lại mật khẩu" className="input-field" disabled={loading} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white mt-2"
              style={{ background: loading ? '#aba7ed' : 'linear-gradient(135deg, #3324BC, #574fdb)' }}>
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-primary-500 font-medium hover:text-primary-600">Đăng nhập</Link>
          </p>
        </div>
        <p className="text-center text-primary-300 text-xs mt-4">© 2024 Etheric Hotel Management. All rights reserved.</p>
      </div>
    </div>
  );
}
