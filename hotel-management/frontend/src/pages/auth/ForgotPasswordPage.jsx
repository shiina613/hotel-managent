import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 60% 40%, #3324BC 0%, #1e1571 60%, #0f0a3d 100%)' }}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-400 opacity-20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-12 bg-primary-500 rounded-xl mb-4">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Etheric Hotel</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {!sent ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Quên mật khẩu?</h2>
              <p className="text-gray-500 text-sm mb-6">Nhập email để nhận hướng dẫn đặt lại mật khẩu</p>
              <form onSubmit={(e) => { e.preventDefault(); if (email) setSent(true); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="email@example.com" className="input-field" required />
                </div>
                <button type="submit" className="w-full py-3 rounded-lg font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #3324BC, #574fdb)' }}>
                  Gửi hướng dẫn
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Email đã được gửi!</h3>
              <p className="text-gray-500 text-sm">Kiểm tra hộp thư <strong>{email}</strong> để đặt lại mật khẩu.</p>
            </div>
          )}
          <p className="text-center text-sm text-gray-500 mt-6">
            <Link to="/login" className="text-primary-500 font-medium hover:text-primary-600 flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              Quay lại đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
