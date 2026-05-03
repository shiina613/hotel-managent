import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const fmt = (n) => new Intl.NumberFormat('vi-VN', { notation: 'compact', maximumFractionDigits: 1 }).format(n || 0);
const fmtFull = (n) => new Intl.NumberFormat('vi-VN').format(n || 0) + ' ₫';

function ChartSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex gap-2 mb-4">
        <div className="h-8 w-20 bg-gray-200 rounded-lg" />
        <div className="h-8 w-20 bg-gray-100 rounded-lg" />
      </div>
      <div className="h-64 bg-gray-100 rounded-xl" />
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-medium text-gray-700 mb-1">{label}</p>
      <p className="text-primary-600 font-semibold">{fmtFull(payload[0]?.value)}</p>
    </div>
  );
}

/**
 * RevenueChart — LineChart doanh thu theo ngày (30 ngày) hoặc tháng (12 tháng)
 *
 * Props:
 *   data: { daily: [{date, revenue}], monthly: [{month, revenue}] }
 *   loading: boolean
 */
export default function RevenueChart({ data, loading }) {
  const [view, setView] = useState('daily'); // 'daily' | 'monthly'

  const chartData =
    view === 'daily'
      ? (data?.daily || []).map((d) => ({
          label: d.date
            ? new Date(d.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
            : d.date,
          revenue: d.revenue,
        }))
      : (data?.monthly || []).map((d) => ({
          label: d.month
            ? new Date(d.month + '-01').toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' })
            : d.month,
          revenue: d.revenue,
        }));

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Doanh thu</h2>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView('daily')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              view === 'daily' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            30 ngày
          </button>
          <button
            onClick={() => setView('monthly')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              view === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            12 tháng
          </button>
        </div>
      </div>

      {loading ? (
        <ChartSkeleton />
      ) : chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
          Chưa có dữ liệu doanh thu
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={fmt}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              width={56}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3324BC"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: '#3324BC', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
