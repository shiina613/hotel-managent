import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', securityAnswer: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.securityAnswer || !form.newPassword) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    if (form.newPassword.length < 8) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await authApi.forgotPassword(form);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message || 'Đặt lại mật khẩu thất bại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 60% 40%, #3324BC 0%, #1e1571 60%, #0f0a3d 100%)' }}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400 opacity-20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-12 bg-primary-500 rounded-xl mb-4">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Etheric Hotel</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {!success ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Quên mật khẩu?</h2>
              <p className="text-gray-500 text-sm mb-6">
                Nhập tên đăng nhập và câu trả lời bảo mật để đặt lại mật khẩu
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Nhập tên đăng nhập"
                    className="input-field"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Câu trả lời bảo mật
                  </label>
                  <input
                    type="text"
                    name="securityAnswer"
                    value={form.securityAnswer}
                    onChange={handleChange}
                    placeholder="Nhập câu trả lời bảo mật"
                    className="input-field"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    placeholder="Tối thiểu 8 ký tự"
                    className="input-field"
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #3324BC, #574fdb)' }}
                >
                  {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Đặt lại mật khẩu thành công!</h3>
              <p className="text-gray-500 text-sm mb-6">
                Mật khẩu của bạn đã được cập nhật. Vui lòng đăng nhập lại.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-lg font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #3324BC, #574fdb)' }}
              >
                Đăng nhập ngay
              </button>
            </div>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            <Link
              to="/login"
              className="text-primary-500 font-medium hover:text-primary-600 flex items-center justify-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
