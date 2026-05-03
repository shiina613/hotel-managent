import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res.data,
  (err) => {
    // Chỉ redirect về login khi 401 và không phải request auth
    if (err.response?.status === 401 && !err.config?.url?.includes('/auth/')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Đảm bảo error message luôn là string — không bao giờ là object hay undefined
    const rawMessage = err.response?.data?.message ?? err.response?.data ?? err.message;
    let message;
    if (typeof rawMessage === 'string' && rawMessage.trim()) {
      message = rawMessage.trim();
    } else if (rawMessage && typeof rawMessage === 'object') {
      // Trường hợp server trả về object thay vì string
      message = rawMessage.error || rawMessage.detail || JSON.stringify(rawMessage);
    } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      message = 'Yêu cầu quá thời gian chờ. Vui lòng thử lại.';
    } else if (!err.response) {
      message = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
    } else {
      message = `Lỗi ${err.response.status}: Đã xảy ra lỗi không mong muốn.`;
    }

    // Preserve fieldErrors from API ValidationErrorResponse so form components can display per-field errors
    const fieldErrors = err.response?.data?.fieldErrors;

    // Reject with an object containing both message and fieldErrors (if present)
    // For backward compatibility, also attach message as a string property
    const rejection = { message, fieldErrors: fieldErrors || null };
    return Promise.reject(rejection);
  }
);

export default axiosClient;
