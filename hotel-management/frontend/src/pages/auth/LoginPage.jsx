import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authApi from '../../api/authApi';

function validate(form) {
  const errors = {};
  if (!form.username.trim()) errors.username = 'Tên đăng nhập không được để trống';
  if (!form.password) errors.password = 'Mật khẩu không được để trống';
  return errors;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [touched, setTouched] = useState({ username: false, password: false });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  const validationErrors = validate(form);
  // Merge inline validation errors with API field errors (API errors take precedence when set)
  const errors = { ...validationErrors, ...fieldErrors };

  const onChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
    // Clear the specific field error when user starts typing
    if (fieldErrors[e.target.name]) {
      setFieldErrors(p => { const next = { ...p }; delete next[e.target.name]; return next; });
    }
  };
  const onBlur = (e) => { setTouched(p => ({ ...p, [e.target.name]: true })); };

  const onSubmit = async (e) => {
    e.preventDefault();
    // Mark all fields as touched to show all errors
    setTouched({ username: true, password: true });
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    const res = await authApi.login(form);
    setLoading(false);
    if (res.success) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      const role = res.data.role;
      if (role === 'ADMIN') navigate('/dashboard');
      else if (role === 'RECEPTIONIST') navigate('/receptionist');
      else navigate('/home'); // CUSTOMER, GUEST
    } else {
      // Handle API field errors (ValidationErrorResponse)
      if (res.fieldErrors && Array.isArray(res.fieldErrors) && res.fieldErrors.length > 0) {
        const apiFieldErrors = res.fieldErrors.reduce((acc, { field, message }) => {
          acc[field] = message;
          return acc;
        }, {});
        setFieldErrors(apiFieldErrors);
        // Mark touched for all fields that have errors
        const touchedFields = res.fieldErrors.reduce((acc, { field }) => { acc[field] = true; return acc; }, {});
        setTouched(p => ({ ...p, ...touchedFields }));
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 60% 40%, #3324BC 0%, #1e1571 60%, #0f0a3d 100%)' }}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400 opacity-20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-600 opacity-10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-12 bg-primary-500 rounded-xl mb-4">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Etheric Hotel</h1>
          <p className="text-primary-200 text-sm mt-1">Hệ thống quản lý khách sạn thông minh</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Đăng nhập</h2>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên đăng nhập</label>
              <input
                name="username"
                value={form.username}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="Nhập tên đăng nhập"
                className={`input-field ${touched.username && errors.username ? 'border-red-400 focus:ring-red-400' : ''}`}
                disabled={loading}
                autoFocus
              />
              {touched.username && errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder="Nhập mật khẩu"
                  className={`input-field pr-10 ${touched.password && errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                  disabled={loading}
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                    : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  }
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-primary-500 hover:text-primary-600">Quên mật khẩu?</Link>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white transition-all"
              style={{ background: loading ? '#aba7ed' : 'linear-gradient(135deg, #3324BC, #574fdb)' }}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-primary-500 font-medium hover:text-primary-600">Đăng ký ngay</Link>
          </p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { label: 'Admin', user: 'admin1', color: 'bg-primary-500/20 text-primary-200' },
            { label: 'Lễ tân', user: 'recep1', color: 'bg-white/15 text-white' },
            { label: 'Khách', user: 'user1', color: 'bg-white/10 text-primary-200' },
          ].map(a => (
            <button key={a.user} onClick={() => setForm({ username: a.user, password: a.user })}
              className={`rounded-xl p-2.5 text-center transition-colors hover:opacity-80 ${a.color}`}>
              <p className="text-xs font-semibold">{a.label}</p>
              <p className="text-xs opacity-75 mt-0.5">{a.user}/{a.user}</p>
            </button>
          ))}
        </div>

        <p className="text-center text-primary-300 text-xs mt-4">© 2024 Etheric Hotel Management. All rights reserved.</p>
      </div>
    </div>
  );
}
