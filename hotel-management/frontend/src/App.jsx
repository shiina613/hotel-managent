import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RoomTypesPage from './pages/roomTypes/RoomTypesPage';
import RoomsPage from './pages/rooms/RoomsPage';
import ServicesPage from './pages/services/ServicesPage';
import BookingsPage from './pages/bookings/BookingsPage';
import InvoicesPage from './pages/invoices/InvoicesPage';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import authApi from './api/authApi';

function App() {
  const isAuthenticated = authApi.isAuthenticated();

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login or dashboard based on auth status */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Public route - Login */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage />
            )
          } 
        />

        {/* Protected routes with AdminLayout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <DashboardPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/room-types"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <RoomTypesPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <RoomsPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ServicesPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <BookingsPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/invoices"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <InvoicesPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
