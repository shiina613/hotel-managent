import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authApi from '../../api/authApi';

function validate(form) {
  const errors = {};

  if (!form.fullName.trim()) errors.fullName = 'Họ tên không được để trống';
  else if (form.fullName.trim().length < 2) errors.fullName = 'Họ tên phải có ít nhất 2 ký tự';

  if (form.phone && !/^\d{10,11}$/.test(form.phone.trim())) {
    errors.phone = 'Số điện thoại phải có 10-11 chữ số';
  }

  if (!form.email.trim()) errors.email = 'Email không được để trống';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Email không đúng định dạng';
  }

  if (!form.username.trim()) errors.username = 'Tên đăng nhập không được để trống';
  else if (form.username.trim().length < 3) errors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';

  if (!form.password) errors.password = 'Mật khẩu không được để trống';
  else if (form.password.length < 8) errors.password = 'Mật khẩu phải có ít nhất 8 ký tự';

  if (!form.confirmPassword) errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
  else if (form.password && form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
  }

  return errors;
}

const ALL_FIELDS = ['fullName', 'phone', 'email', 'username', 'password', 'confirmPassword'];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '', fullName: '', email: '', phone: '' });
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validationErrors = validate(form);
  // Merge inline validation errors with API field errors
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
    const allTouched = ALL_FIELDS.reduce((acc, f) => ({ ...acc, [f]: true }), {});
    setTouched(allTouched);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    const res = await authApi.register({
      username: form.username,
      password: form.password,
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      role: 'CUSTOMER',
      status: 'ACTIVE',
    });
    setLoading(false);
    if (res.success) {
      navigate('/login');
    } else {
      // Handle API field errors (ValidationErrorResponse)
      if (res.fieldErrors && Array.isArray(res.fieldErrors) && res.fieldErrors.length > 0) {
        const apiFieldErrors = res.fieldErrors.reduce((acc, { field, message }) => {
          acc[field] = message;
          return acc;
        }, {});
        setFieldErrors(apiFieldErrors);
        const touchedFields = res.fieldErrors.reduce((acc, { field }) => { acc[field] = true; return acc; }, {});
        setTouched(p => ({ ...p, ...touchedFields }));
      } else {
        setError(res.message || 'Đăng ký thất bại');
      }
    }
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
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder="Nguyễn Văn A"
                  className={`input-field ${touched.fullName && errors.fullName ? 'border-red-400 focus:ring-red-400' : ''}`}
                  disabled={loading}
                />
                {touched.fullName && errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder="0901234567"
                  className={`input-field ${touched.phone && errors.phone ? 'border-red-400 focus:ring-red-400' : ''}`}
                  disabled={loading}
                />
                {touched.phone && errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="email@example.com"
                className={`input-field ${touched.email && errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                disabled={loading}
              />
              {touched.email && errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên đăng nhập <span className="text-red-500">*</span></label>
              <input
                name="username"
                value={form.username}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="Tên đăng nhập"
                className={`input-field ${touched.username && errors.username ? 'border-red-400 focus:ring-red-400' : ''}`}
                disabled={loading}
              />
              {touched.username && errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu <span className="text-red-500">*</span></label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="Tối thiểu 8 ký tự"
                className={`input-field ${touched.password && errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                disabled={loading}
              />
              {touched.password && errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu <span className="text-red-500">*</span></label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="Nhập lại mật khẩu"
                className={`input-field ${touched.confirmPassword && errors.confirmPassword ? 'border-red-400 focus:ring-red-400' : ''}`}
                disabled={loading}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
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
