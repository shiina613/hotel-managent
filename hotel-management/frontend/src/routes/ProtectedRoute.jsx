import { Navigate } from 'react-router-dom';
import authApi from '../api/authApi';

const ROLE_HOME = {
  ADMIN: '/dashboard',
  RECEPTIONIST: '/receptionist',
  CUSTOMER: '/home',
};

// requiredRole: string | string[]
const ProtectedRoute = ({ children, requiredRole }) => {
  const user = authApi.getCurrentUser();
  const token = localStorage.getItem('token');

  if (!token || !user) return <Navigate to="/login" replace />;

  if (requiredRole) {
    const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowed.includes(user.role)) {
      return <Navigate to={ROLE_HOME[user.role] || '/login'} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
