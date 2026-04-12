import axiosClient from './axiosClient';

const authApi = {
  login: async (credentials) => {
    try {
      const res = await axiosClient.post('/auth/login', credentials);
      if (res?.data) return { success: true, data: res.data, message: res.message };
      return { success: false, message: res?.message || 'Đăng nhập thất bại' };
    } catch (e) {
      return { success: false, message: typeof e === 'string' ? e : 'Tên đăng nhập hoặc mật khẩu không chính xác' };
    }
  },
  register: (data) => axiosClient.post('/auth/register', data),
  logout: () => { localStorage.removeItem('token'); localStorage.removeItem('user'); },
  getCurrentUser: () => { try { const u = localStorage.getItem('user'); return u ? JSON.parse(u) : null; } catch { return null; } },
  isAuthenticated: () => !!localStorage.getItem('token'),
};

export default authApi;
