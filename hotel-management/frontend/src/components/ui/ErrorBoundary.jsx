import React from 'react';

/**
 * ErrorBoundary — bắt lỗi render trong cây component con.
 * Hiển thị fallback UI thân thiện với nút "Tải lại trang".
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log lỗi để debug — trong production có thể gửi lên error tracking service
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Component stack:', info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Nếu có fallback prop tùy chỉnh, dùng nó
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center">
            {/* Icon lỗi */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* Tiêu đề */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Đã xảy ra lỗi
            </h1>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Trang này gặp sự cố không mong muốn. Vui lòng tải lại trang hoặc quay về trang chủ.
            </p>

            {/* Chi tiết lỗi (chỉ hiện trong development) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 text-left bg-red-50 border border-red-200 rounded-xl p-4">
                <summary className="text-xs font-medium text-red-700 cursor-pointer select-none">
                  Chi tiết lỗi (chỉ hiện trong development)
                </summary>
                <pre className="mt-2 text-xs text-red-600 overflow-auto whitespace-pre-wrap break-words">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            {/* Nút hành động */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all"
                style={{ background: 'linear-gradient(135deg, #3324BC, #574fdb)' }}
              >
                Tải lại trang
              </button>
              <button
                onClick={() => { window.location.href = '/'; }}
                className="px-6 py-3 rounded-xl font-semibold text-gray-700 text-sm border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
