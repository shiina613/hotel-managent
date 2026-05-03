import axiosClient from './axiosClient';

// Helper: extract message string from axiosClient rejection (object or string)
function extractMessage(e, fallback) {
  if (e && typeof e === 'object' && e.message) return e.message;
  if (typeof e === 'string') return e;
  return fallback;
}

const authApi = {
  login: async (credentials) => {
    try {
      const res = await axiosClient.post('/auth/login', credentials);
      if (res?.data) return { success: true, data: res.data, message: res.message };
      return { success: false, message: res?.message || 'Đăng nhập thất bại' };
    } catch (e) {
      return {
        success: false,
        message: extractMessage(e, 'Tên đăng nhập hoặc mật khẩu không chính xác'),
        fieldErrors: (e && typeof e === 'object') ? e.fieldErrors : null,
      };
    }
  },
  register: async (data) => {
    try {
      const res = await axiosClient.post('/auth/register', data);
      return { success: true, data: res?.data ?? res, message: res?.message || 'Đăng ký thành công' };
    } catch (e) {
      return {
        success: false,
        message: extractMessage(e, 'Đăng ký thất bại'),
        fieldErrors: (e && typeof e === 'object') ? e.fieldErrors : null,
      };
    }
  },
  logout: () => { localStorage.removeItem('token'); localStorage.removeItem('user'); },
  getCurrentUser: () => { try { const u = localStorage.getItem('user'); return u ? JSON.parse(u) : null; } catch { return null; } },
  isAuthenticated: () => !!localStorage.getItem('token'),
  forgotPassword: async ({ username, securityAnswer, newPassword }) => {
    try {
      const res = await axiosClient.post('/auth/forgot-password', { username, securityAnswer, newPassword });
      return { success: true, message: res?.message || 'Mật khẩu đã được đặt lại thành công' };
    } catch (e) {
      return { success: false, message: extractMessage(e, 'Đặt lại mật khẩu thất bại') };
    }
  },
};

export default authApi;
