import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Global Error Boundary that catches unhandled React errors.
 * Shows a friendly Korean UI with retry/home options.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#fffef5] flex items-center justify-center px-6">
          <div className="max-w-sm w-full text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-[#fff4e0] rounded-full flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-[#f5a145]" />
            </div>

            {/* Title */}
            <h1 className="text-xl font-bold text-[#2d3e2d] mb-2">
              앗, 문제가 발생했어요
            </h1>

            {/* Description */}
            <p className="text-[#6b8e6f] mb-6 text-sm leading-relaxed">
              일시적인 오류가 발생했습니다.<br />
              다시 시도하거나, 홈으로 돌아가주세요.
            </p>

            {/* Error details (dev mode) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-xs text-gray-400 cursor-pointer">
                  오류 상세 (개발 모드)
                </summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg overflow-auto max-h-32">
                  {this.state.error.message}
                  {'\n'}
                  {this.state.error.stack?.split('\n').slice(0, 5).join('\n')}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#6b8e6f] text-white rounded-xl font-medium hover:bg-[#5a7a5e] transition-colors"
              >
                <RefreshCw size={18} />
                다시 시도
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white text-[#2d3e2d] border-2 border-[#d4c5a0] rounded-xl font-medium hover:bg-[#f9f6ed] transition-colors"
              >
                <Home size={18} />
                홈으로
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
