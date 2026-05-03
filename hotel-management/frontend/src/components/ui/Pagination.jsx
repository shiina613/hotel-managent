/**
 * Pagination component
 * Props:
 *   currentPage   — 0-indexed (from backend)
 *   totalPages    — total number of pages
 *   totalElements — total record count
 *   pageSize      — records per page
 *   onPageChange  — callback(newPage: number)
 */
export default function Pagination({ currentPage, totalPages, totalElements, pageSize, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  // "Hiển thị X-Y trong tổng số Z bản ghi"
  const from = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const to = Math.min((currentPage + 1) * pageSize, totalElements);

  // Build page number list with ellipsis
  const buildPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 4) pages.push('...');
      pages.push(totalPages - 1);
    }
    return pages;
  };

  const pages = buildPages();

  const btnBase =
    'inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium transition-colors';
  const btnActive =
    'bg-primary-500 text-white shadow-sm';
  const btnInactive =
    'text-gray-600 hover:bg-gray-100';
  const btnDisabled =
    'text-gray-300 cursor-not-allowed';

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-3 mt-2">
      {/* Record info */}
      <p className="text-sm text-gray-500 whitespace-nowrap">
        Hiển thị <span className="font-medium text-gray-700">{from}–{to}</span> trong tổng số{' '}
        <span className="font-medium text-gray-700">{totalElements}</span> bản ghi
      </p>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className={`${btnBase} px-2 gap-1 ${currentPage === 0 ? btnDisabled : btnInactive}`}
          aria-label="Trang trước"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline text-xs">Trước</span>
        </button>

        {/* Page numbers */}
        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={`ellipsis-${idx}`} className="w-8 text-center text-gray-400 text-sm select-none">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`${btnBase} ${p === currentPage ? btnActive : btnInactive}`}
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p + 1}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className={`${btnBase} px-2 gap-1 ${currentPage >= totalPages - 1 ? btnDisabled : btnInactive}`}
          aria-label="Trang sau"
        >
          <span className="hidden sm:inline text-xs">Sau</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
