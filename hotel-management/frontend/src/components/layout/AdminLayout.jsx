import Sidebar from './Sidebar';
import authApi from '../../api/authApi';

const AdminLayout = ({ children, role }) => {
  const user = authApi.getCurrentUser();
  const r = role || user?.role || 'ADMIN';
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar role={r} />
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-100 h-14 flex items-center justify-end px-6 sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 text-sm font-semibold">{user?.fullName?.charAt(0) || 'U'}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
