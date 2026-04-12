import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ReceptionistPage from './pages/ReceptionistPage';
import RoomsPage from './pages/rooms/RoomsPage';
import RoomTypesPage from './pages/roomTypes/RoomTypesPage';
import ServicesPage from './pages/services/ServicesPage';
import BookingsPage from './pages/bookings/BookingsPage';
import InvoicesPage from './pages/invoices/InvoicesPage';
import UsersPage from './pages/users/UsersPage';
import RoomDetailPage from './pages/RoomDetailPage';
import MyBookingsPage from './pages/bookings/MyBookingsPage';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import authApi from './api/authApi';

const RootRedirect = () => {
  const user = authApi.getCurrentUser();
  const token = localStorage.getItem('token');
  if (!token || !user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/dashboard" replace />;
  if (user.role === 'RECEPTIONIST') return <Navigate to="/receptionist" replace />;
  return <Navigate to="/home" replace />;
};

const LoginRoute = () => {
  const user = authApi.getCurrentUser();
  const token = localStorage.getItem('token');
  if (!token || !user) return <LoginPage />;
  if (user.role === 'ADMIN') return <Navigate to="/dashboard" replace />;
  if (user.role === 'RECEPTIONIST') return <Navigate to="/receptionist" replace />;
  return <Navigate to="/home" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Customer */}
        <Route path="/home" element={
          <ProtectedRoute requiredRole="CUSTOMER"><HomePage /></ProtectedRoute>
        } />
        <Route path="/room/:id" element={
          <ProtectedRoute requiredRole="CUSTOMER"><RoomDetailPage /></ProtectedRoute>
        } />
        <Route path="/my-bookings" element={
          <ProtectedRoute requiredRole="CUSTOMER"><MyBookingsPage /></ProtectedRoute>
        } />

        {/* Receptionist */}
        <Route path="/receptionist" element={
          <ProtectedRoute requiredRole="RECEPTIONIST"><ReceptionistPage /></ProtectedRoute>
        } />
        <Route path="/receptionist/rooms" element={
          <ProtectedRoute requiredRole="RECEPTIONIST"><AdminLayout role="RECEPTIONIST"><RoomsPage /></AdminLayout></ProtectedRoute>
        } />
        <Route path="/receptionist/bookings" element={
          <ProtectedRoute requiredRole="RECEPTIONIST"><AdminLayout role="RECEPTIONIST"><BookingsPage /></AdminLayout></ProtectedRoute>
        } />
        <Route path="/receptionist/invoices" element={
          <ProtectedRoute requiredRole="RECEPTIONIST"><AdminLayout role="RECEPTIONIST"><InvoicesPage /></AdminLayout></ProtectedRoute>
        } />

        {/* Admin */}
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole="ADMIN"><AdminLayout><DashboardPage /></AdminLayout></ProtectedRoute>
        } />
        <Route path="/rooms" element={
          <ProtectedRoute requiredRole="ADMIN"><AdminLayout><RoomsPage /></AdminLayout></ProtectedRoute>
        } />
        <Route path="/room-types" element={
          <ProtectedRoute requiredRole="ADMIN"><AdminLayout><RoomTypesPage /></AdminLayout></ProtectedRoute>
        } />
        <Route path="/services" element={
          <ProtectedRoute requiredRole="ADMIN"><AdminLayout><ServicesPage /></AdminLayout></ProtectedRoute>
        } />
        <Route path="/bookings" element={
          <ProtectedRoute requiredRole="ADMIN"><AdminLayout><BookingsPage /></AdminLayout></ProtectedRoute>
        } />
        <Route path="/invoices" element={
          <ProtectedRoute requiredRole="ADMIN"><AdminLayout><InvoicesPage /></AdminLayout></ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute requiredRole="ADMIN"><AdminLayout><UsersPage /></AdminLayout></ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
