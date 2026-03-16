import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import ReceptionistPage from './pages/ReceptionistPage';
import RoomTypesPage from './pages/roomTypes/RoomTypesPage';
import RoomsPage from './pages/rooms/RoomsPage';
import ServicesPage from './pages/services/ServicesPage';
import BookingsPage from './pages/bookings/BookingsPage';
import InvoicesPage from './pages/invoices/InvoicesPage';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';

// Helper: đọc thẳng từ localStorage, không qua authApi để tránh circular
const getToken = () => localStorage.getItem('token');
const getUser = () => {
  try {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
};

// Component xử lý redirect sau khi đăng nhập
const RootRedirect = () => {
  const token = getToken();
  const user = getUser();

  if (!token) return <Navigate to="/login" replace />;

  switch (user?.role) {
    case 'ADMIN':        return <Navigate to="/dashboard" replace />;
    case 'RECEPTIONIST': return <Navigate to="/receptionist" replace />;
    case 'CUSTOMER':     return <Navigate to="/home" replace />;
    default:             return <Navigate to="/login" replace />;
  }
};

// Component bảo vệ route login (nếu đã đăng nhập thì redirect)
const LoginRoute = () => {
  const token = getToken();
  const user = getUser();

  if (!token) return <LoginPage />;

  switch (user?.role) {
    case 'ADMIN':        return <Navigate to="/dashboard" replace />;
    case 'RECEPTIONIST': return <Navigate to="/receptionist" replace />;
    case 'CUSTOMER':     return <Navigate to="/home" replace />;
    default:             return <LoginPage />;
  }
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<RootRedirect />} />
        <Route path="/login"  element={<LoginRoute />} />

        {/* Customer */}
        <Route path="/home" element={
          <ProtectedRoute requiredRole="CUSTOMER">
            <HomePage />
          </ProtectedRoute>
        } />

        {/* Receptionist */}
        <Route path="/receptionist" element={
          <ProtectedRoute requiredRole="RECEPTIONIST">
            <ReceptionistPage />
          </ProtectedRoute>
        } />

        {/* Admin */}
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout><DashboardPage /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/room-types" element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout><RoomTypesPage /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/rooms" element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout><RoomsPage /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/services" element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout><ServicesPage /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/bookings" element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout><BookingsPage /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/invoices" element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout><InvoicesPage /></AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
