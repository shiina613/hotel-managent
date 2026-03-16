import { Navigate } from 'react-router-dom';

const getToken = () => localStorage.getItem('token');
const getUser = () => {
  try {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
};

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const token = getToken();
  const user = getUser();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect về đúng trang của role hiện tại
    switch (user?.role) {
      case 'ADMIN':        return <Navigate to="/dashboard" replace />;
      case 'RECEPTIONIST': return <Navigate to="/receptionist" replace />;
      case 'CUSTOMER':     return <Navigate to="/home" replace />;
      default:             return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
