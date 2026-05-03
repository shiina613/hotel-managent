/**
 * TableSkeleton — skeleton loading rows cho bảng danh sách
 *
 * Props:
 *   rows    — số dòng skeleton (mặc định 5)
 *   cols    — số cột skeleton (mặc định 5)
 *   hasAction — có cột action ở cuối không (mặc định true)
 */
export default function TableSkeleton({ rows = 5, cols = 5, hasAction = true }) {
  const dataCols = hasAction ? cols - 1 : cols;

  return (
    <div className="overflow-x-auto animate-pulse">
      <table className="w-full text-sm">
        {/* Header skeleton */}
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-5 py-3">
                <div className="h-3 bg-gray-200 rounded w-16" />
              </th>
            ))}
          </tr>
        </thead>

        {/* Body skeleton */}
        <tbody className="divide-y divide-gray-50">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx}>
              {/* ID column — narrow */}
              <td className="px-5 py-3.5">
                <div className="h-3 bg-gray-100 rounded w-8" />
              </td>

              {/* Main content columns */}
              {Array.from({ length: dataCols - 1 }).map((_, colIdx) => (
                <td key={colIdx} className="px-5 py-3.5">
                  <div
                    className="h-3 bg-gray-100 rounded"
                    style={{ width: `${60 + ((rowIdx * 3 + colIdx * 7) % 30)}%` }}
                  />
                </td>
              ))}

              {/* Action column — icon placeholders */}
              {hasAction && (
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5 justify-end">
                    <div className="w-7 h-7 bg-gray-100 rounded-lg" />
                    <div className="w-7 h-7 bg-gray-100 rounded-lg" />
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
