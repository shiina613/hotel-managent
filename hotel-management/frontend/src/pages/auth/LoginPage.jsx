import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';

const LoginPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Tên đăng nhập là bắt buộc';
    }
    
    if (!formData.password) {
      errors.password = 'Mật khẩu là bắt buộc';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await authApi.login({
        username: formData.username,
        password: formData.password
      });
      
      if (response.success) {
        if (response.data?.token) {
          localStorage.setItem('token', response.data.token);
        }
        
        if (response.data) {
          const userInfo = {
            userId: response.data.userId,
            username: response.data.username,
            fullName: response.data.fullName,
            email: response.data.email,
            role: response.data.role
          };
          localStorage.setItem('user', JSON.stringify(userInfo));
        }
        
        const role = response.data?.role;
        if (role === 'ADMIN') {
          navigate('/dashboard');
        } else if (role === 'RECEPTIONIST') {
          navigate('/receptionist');
        } else if (role === 'CUSTOMER') {
          navigate('/home');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(response.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      setError(err || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <span className="text-3xl">🏨</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Luxury Hotel
            </h1>
            <p className="text-gray-600">
              Đăng nhập để truy cập hệ thống
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-red-600 mr-2">⚠️</span>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tên Đăng Nhập
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  validationErrors.username 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                }`}
                placeholder="Nhập tên đăng nhập"
                disabled={loading}
              />
              {validationErrors.username && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.username}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mật Khẩu
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  validationErrors.password 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                }`}
                placeholder="Nhập mật khẩu"
                disabled={loading}
              />
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
              }`}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-4 text-center">
              📝 Tài Khoản Demo
            </p>
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="font-semibold text-blue-900 text-sm">👨‍💼 Admin</p>
                <p className="text-xs text-blue-700">admin001 / admin123</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg">
                <p className="font-semibold text-amber-900 text-sm">👩‍💼 Lễ Tân</p>
                <p className="text-xs text-amber-700">receptionist001 / receptionist123</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="font-semibold text-green-900 text-sm">👤 Khách Hàng</p>
                <p className="text-xs text-green-700">customer001 / customer123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            © 2024 Luxury Hotel. Bảo lưu mọi quyền.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
