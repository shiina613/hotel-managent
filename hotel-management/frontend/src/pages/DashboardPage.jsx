import { useState, useEffect, useCallback } from 'react';
import authApi from '../api/authApi';
import dashboardApi from '../api/dashboardApi';
import SummaryCards from '../components/dashboard/SummaryCards';
import RevenueChart from '../components/dashboard/RevenueChart';
import BookingStatusChart from '../components/dashboard/BookingStatusChart';
import CardSkeleton from '../components/ui/CardSkeleton';

const fmtCurrency = (n) =>
  new Intl.NumberFormat('vi-VN', { notation: 'compact', maximumFractionDigits: 1 }).format(n || 0) + ' ₫';

// ─── Top Services Table ───────────────────────────────────────────────────────

function TopServicesTable({ data, loading }) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-4 w-4 bg-gray-200 rounded" />
            <div className="h-4 flex-1 bg-gray-100 rounded" />
            <div className="h-4 w-16 bg-gray-100 rounded" />
            <div className="h-4 w-20 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="py-8 text-center text-gray-400 text-sm">Chưa có dữ liệu dịch vụ</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {['#', 'Dịch vụ', 'Số lượng', 'Doanh thu'].map((h) => (
              <th key={h} className="text-left pb-3 text-xs font-medium text-gray-500 uppercase pr-4 last:pr-0">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((svc, idx) => (
            <tr key={svc.serviceId ?? idx} className="hover:bg-gray-50">
              <td className="py-3 pr-4 text-gray-400 font-medium">{idx + 1}</td>
              <td className="py-3 pr-4 font-medium text-gray-900">{svc.serviceName}</td>
              <td className="py-3 pr-4 text-gray-600">{svc.totalQuantity}</td>
              <td className="py-3 text-gray-600">{fmtCurrency(svc.totalRevenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Error Banner ─────────────────────────────────────────────────────────────

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-sm text-red-700">{message || 'Không thể tải dữ liệu dashboard.'}</p>
      </div>
      <button
        onClick={onRetry}
        className="flex-shrink-0 text-sm font-medium text-red-600 hover:text-red-800 border border-red-300 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors"
      >
        Thử lại
      </button>
    </div>
  );
}

// ─── DashboardPage ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const user = authApi.getCurrentUser();

  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [bookingStats, setBookingStats] = useState(null);
  const [topServices, setTopServices] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, revenueRes, bookingStatsRes, topServicesRes] = await Promise.all([
        dashboardApi.getSummary(),
        dashboardApi.getRevenue(),
        dashboardApi.getBookingStats(),
        dashboardApi.getTopServices(),
      ]);

      // axiosClient returns res.data directly (interceptor unwraps)
      // Backend wraps in ApiResponse: { success, data, message }
      setSummary(summaryRes?.data ?? summaryRes);
      setRevenue(revenueRes?.data ?? revenueRes);
      setBookingStats(bookingStatsRes?.data ?? bookingStatsRes);
      setTopServices(topServicesRes?.data ?? topServicesRes);
    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.message || 'Lỗi kết nối đến server';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Tổng quan</h1>
        <p className="text-sm text-gray-500 mt-0.5">Chào mừng trở lại, {user?.fullName}!</p>
      </div>

      {/* Error banner */}
      {error && <ErrorBanner message={error} onRetry={fetchAll} />}

      {/* Summary cards */}
      <SummaryCards data={summary} loading={loading} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueChart data={revenue} loading={loading} />
        </div>
        <div>
          <BookingStatusChart data={bookingStats} loading={loading} />
        </div>
      </div>

      {/* Top services */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Top 5 dịch vụ</h2>
        {loading
          ? <CardSkeleton variant="list" rows={5} />
          : <TopServicesTable data={topServices} loading={false} />
        }
      </div>
    </div>
  );
}
