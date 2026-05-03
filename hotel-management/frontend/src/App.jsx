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
import ErrorBoundary from './components/ui/ErrorBoundary';
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
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Customer */}
          <Route path="/home" element={
            <ErrorBoundary>
              <ProtectedRoute requiredRole="CUSTOMER"><HomePage /></ProtectedRoute>
            </ErrorBoundary>
          } />
          <Route path="/room/:id" element={
            <ErrorBoundary>
              <ProtectedRoute requiredRole="CUSTOMER"><RoomDetailPage /></ProtectedRoute>
            </ErrorBoundary>
          } />
          <Route path="/my-bookings" element={
            <ErrorBoundary>
              <ProtectedRoute requiredRole="CUSTOMER"><MyBookingsPage /></ProtectedRoute>
            </ErrorBoundary>
          } />

          {/* Receptionist */}
          <Route path="/receptionist" element={
            <ErrorBoundary>
              <ProtectedRoute requiredRole="RECEPTIONIST"><ReceptionistPage /></ProtectedRoute>
            </ErrorBoundary>
          } />
          <Route path="/receptionist/rooms" element={
            <ErrorBoundary>
              <ProtectedRoute requiredRole="RECEPTIONIST"><AdminLayout role="RECEPTIONIST"><RoomsPage /></AdminLayout></ProtectedRoute>
            </ErrorBoundary>
          } />
          <Route path="/receptionist/bookings" element={
            <ErrorBoundary>
              <ProtectedRoute requiredRole="RECEPTIONIST"><AdminLayout role="RECEPTIONIST"><BookingsPage /></AdminLayout></ProtectedRoute>
            </ErrorBoundary>
          } />
          <Route path="/receptionist/invoices" element={
            <ErrorBoundary>
              <ProtectedRoute requiredRole="RECEPTIONIST"><AdminLayout role="RECEPTIONIST"><InvoicesPage /></AdminLayout></ProtectedRoute>
            </ErrorBoundary>
          } />

          {/* Admin */}
          <Route path="/dashboard" element={
            <ErrorBoundary>
              <ProtectedRoute requiredRole="ADMIN"><AdminLayout><DashboardPage /></AdminLayout></ProtectedRoute>
            </ErrorBoundary>
          } />
          <Route path="/rooms" element={
            <ErrorBoundary>
              <ProtectedRoute requiredRole="ADMIN"><AdminLayout><RoomsPage /></AdminLayout></ProtectedRoute>
            </ErrorBoundary>
          } />
          <Route path="/room-types" element={
            <ErrorBoundary>
              <ProtectedRoute requiredRole="ADMIN"><AdminLayout><RoomTypesPage /></AdminLayout></ProtectedRoute>
            </ErrorBoundary>
          } />
          <Route path="/services" element={
            <ErrorBoundary>
              <ProtectedRoute requiredRole="ADMIN"><AdminLayout><ServicesPage /></AdminLayout></ProtectedRoute>
            </ErrorBoundary>
          } />
          <Route path="/bookings" element={
            <ErrorBoundary>
              <ProtectedRoute requiredRole="ADMIN"><AdminLayout><BookingsPage /></AdminLayout></ProtectedRoute>
            </ErrorBoundary>
          } />
          <Route path="/invoices" element={
            <ErrorBoundary>
              <ProtectedRoute requiredRole="ADMIN"><AdminLayout><InvoicesPage /></AdminLayout></ProtectedRoute>
            </ErrorBoundary>
          } />
          <Route path="/users" element={
            <ErrorBoundary>
              <ProtectedRoute requiredRole="ADMIN"><AdminLayout><UsersPage /></AdminLayout></ProtectedRoute>
            </ErrorBoundary>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
