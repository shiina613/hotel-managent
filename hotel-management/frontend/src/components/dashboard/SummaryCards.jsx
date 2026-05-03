const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n || 0) + ' ₫';
const pct = (n) => ((n || 0) * 100).toFixed(1) + '%';

function SummaryCard({ label, value, sub, colorBg, colorIcon, icon, loading }) {
  if (loading) {
    return (
      <div className="card p-5 flex items-center gap-4 animate-pulse">
        <div className={`w-12 h-12 rounded-xl flex-shrink-0 ${colorBg} opacity-40`} />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-6 bg-gray-200 rounded w-32" />
          <div className="h-2.5 bg-gray-100 rounded w-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorBg}`}>
        <span className={colorIcon}>{icon}</span>
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

/**
 * SummaryCards — hiển thị 4 thẻ tổng quan từ dữ liệu dashboard/summary
 *
 * Props:
 *   data: { revenueThisMonth, newBookingsToday, occupiedRooms, totalRooms, occupancyRate }
 *   loading: boolean
 */
export default function SummaryCards({ data, loading }) {
  const cards = [
    {
      label: 'Doanh thu tháng này',
      value: loading ? '—' : fmt(data?.revenueThisMonth),
      sub: 'Từ hóa đơn đã thanh toán',
      colorBg: 'bg-purple-50',
      colorIcon: 'text-purple-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Booking mới hôm nay',
      value: loading ? '—' : (data?.newBookingsToday ?? 0),
      sub: 'Tính từ 00:00 hôm nay',
      colorBg: 'bg-blue-50',
      colorIcon: 'text-blue-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Phòng đang có khách',
      value: loading ? '—' : (data?.occupiedRooms ?? 0),
      sub: loading ? '' : `Trên tổng ${data?.totalRooms ?? 0} phòng`,
      colorBg: 'bg-green-50',
      colorIcon: 'text-green-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      label: 'Tỷ lệ lấp đầy',
      value: loading ? '—' : pct(data?.occupancyRate),
      sub: 'Phòng đang check-in / tổng phòng',
      colorBg: 'bg-primary-50',
      colorIcon: 'text-primary-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <SummaryCard key={card.label} {...card} loading={loading} />
      ))}
    </div>
  );
}
