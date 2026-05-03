import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const STATUS_CONFIG = {
  PENDING:      { label: 'Chờ xử lý',    color: '#f59e0b' },
  CONFIRMED:    { label: 'Đã xác nhận',  color: '#3b82f6' },
  CHECKED_IN:   { label: 'Đang ở',       color: '#10b981' },
  CHECKED_OUT:  { label: 'Đã trả phòng', color: '#6b7280' },
  CANCELLED:    { label: 'Đã hủy',       color: '#ef4444' },
};

function ChartSkeleton() {
  return (
    <div className="animate-pulse flex flex-col items-center gap-4">
      <div className="w-48 h-48 rounded-full bg-gray-100" />
      <div className="flex gap-3 flex-wrap justify-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 w-20 bg-gray-100 rounded" />
        ))}
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  const cfg = STATUS_CONFIG[name] || {};
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-medium text-gray-700">{cfg.label || name}</p>
      <p className="text-gray-900 font-semibold">{value} booking</p>
    </div>
  );
}

function CustomLegend({ payload }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3">
      {payload.map((entry) => {
        const cfg = STATUS_CONFIG[entry.value] || {};
        return (
          <div key={entry.value} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
            {cfg.label || entry.value}
          </div>
        );
      })}
    </div>
  );
}

/**
 * BookingStatusChart — PieChart phân bổ trạng thái booking
 *
 * Props:
 *   data: { PENDING, CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED }
 *   loading: boolean
 */
export default function BookingStatusChart({ data, loading }) {
  const chartData = Object.entries(STATUS_CONFIG)
    .map(([key, cfg]) => ({
      name: key,
      value: data?.[key] ?? 0,
      color: cfg.color,
    }))
    .filter((d) => d.value > 0);

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="card p-5">
      <h2 className="font-semibold text-gray-900 mb-4">Trạng thái booking</h2>

      {loading ? (
        <ChartSkeleton />
      ) : total === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
          Chưa có dữ liệu booking
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      )}

      {!loading && total > 0 && (
        <p className="text-center text-xs text-gray-400 mt-1">Tổng {total} booking</p>
      )}
    </div>
  );
}
