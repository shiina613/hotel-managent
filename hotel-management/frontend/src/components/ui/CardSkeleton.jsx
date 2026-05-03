/**
 * CardSkeleton — skeleton loading cho các loại card
 *
 * Variants:
 *   "summary"  — summary card với icon + số liệu (dùng cho Dashboard SummaryCards)
 *   "chart"    — card chứa biểu đồ (dùng cho RevenueChart, BookingStatusChart)
 *   "list"     — card chứa danh sách dòng (dùng cho Top Services)
 *   "default"  — card đơn giản với vài dòng text
 *
 * Props:
 *   variant  — "summary" | "chart" | "list" | "default" (mặc định "default")
 *   count    — số card cần render (mặc định 1)
 *   rows     — số dòng cho variant "list" (mặc định 5)
 *   className — class bổ sung
 */
export default function CardSkeleton({ variant = 'default', count = 1, rows = 5, className = '' }) {
  const items = Array.from({ length: count });

  if (variant === 'summary') {
    return (
      <>
        {items.map((_, i) => (
          <div key={i} className={`card p-5 flex items-center gap-4 animate-pulse ${className}`}>
            {/* Icon placeholder */}
            <div className="w-12 h-12 rounded-xl bg-gray-200 flex-shrink-0" />
            {/* Text placeholders */}
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-24" />
              <div className="h-6 bg-gray-200 rounded w-32" />
              <div className="h-2.5 bg-gray-100 rounded w-20" />
            </div>
          </div>
        ))}
      </>
    );
  }

  if (variant === 'chart') {
    return (
      <>
        {items.map((_, i) => (
          <div key={i} className={`card p-5 animate-pulse ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-gray-200 rounded w-28" />
              <div className="flex gap-1">
                <div className="h-7 w-16 bg-gray-200 rounded-lg" />
                <div className="h-7 w-16 bg-gray-100 rounded-lg" />
              </div>
            </div>
            {/* Chart area */}
            <div className="h-64 bg-gray-100 rounded-xl" />
          </div>
        ))}
      </>
    );
  }

  if (variant === 'list') {
    return (
      <>
        {items.map((_, i) => (
          <div key={i} className={`card p-5 animate-pulse ${className}`}>
            {/* Header */}
            <div className="h-4 bg-gray-200 rounded w-32 mb-4" />
            {/* List rows */}
            <div className="space-y-3">
              {Array.from({ length: rows }).map((_, rowIdx) => (
                <div key={rowIdx} className="flex items-center gap-3">
                  <div className="h-3 w-4 bg-gray-200 rounded flex-shrink-0" />
                  <div
                    className="h-3 bg-gray-100 rounded flex-1"
                    style={{ maxWidth: `${55 + (rowIdx * 9) % 30}%` }}
                  />
                  <div className="h-3 w-12 bg-gray-100 rounded flex-shrink-0" />
                  <div className="h-3 w-16 bg-gray-100 rounded flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </>
    );
  }

  // default
  return (
    <>
      {items.map((_, i) => (
        <div key={i} className={`card p-5 animate-pulse ${className}`}>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      ))}
    </>
  );
}
