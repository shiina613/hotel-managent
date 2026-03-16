import axiosClient from './axiosClient';

// Mock users database for demo
const mockUsers = [
  {
    userId: 'admin001',
    username: 'admin001',
    password: 'admin123',
    fullName: 'Nguyễn Văn Admin',
    email: 'admin@luxuryhotel.com',
    role: 'ADMIN',
    token: 'token_admin_demo_12345'
  },
  {
    userId: 'receptionist001',
    username: 'receptionist001',
    password: 'receptionist123',
    fullName: 'Trần Thị Lễ Tân',
    email: 'receptionist@luxuryhotel.com',
    role: 'RECEPTIONIST',
    token: 'token_receptionist_demo_12345'
  },
  {
    userId: 'customer001',
    username: 'customer001',
    password: 'customer123',
    fullName: 'Phạm Minh Khách',
    email: 'customer@luxuryhotel.com',
    role: 'CUSTOMER',
    token: 'token_customer_demo_12345'
  }
];

const authApi = {
  // Login user - Demo version with mock data
  login: async (credentials) => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const { username, password } = credentials;
      
      // Find user in mock database
      const user = mockUsers.find(u => u.username === username && u.password === password);
      
      if (user) {
        // Return success response
        return {
          success: true,
          data: {
            userId: user.userId,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            token: user.token
          },
          message: 'Đăng nhập thành công'
        };
      } else {
        // Return error response
        return {
          success: false,
          message: 'Tên đăng nhập hoặc mật khẩu không chính xác'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Lỗi đăng nhập. Vui lòng thử lại.'
      };
    }
  },

  // Register user
  register: (userData) => {
    return axiosClient.post('/auth/register', userData);
  },

  // Logout (client-side only for now)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get demo accounts info (for display purposes)
  getDemoAccounts: () => {
    return mockUsers.map(user => ({
      username: user.username,
      password: user.password,
      fullName: user.fullName,
      role: user.role
    }));
  }
};

export default authApi;
