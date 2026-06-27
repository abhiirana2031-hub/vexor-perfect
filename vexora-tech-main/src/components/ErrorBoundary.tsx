import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Global ErrorBoundary - Catches any runtime React error and prevents
 * the entire app from going blank. Shows a minimal fallback instead.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen w-full bg-[#03050a] text-white flex items-center justify-center p-8">
          <div className="max-w-lg text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black tracking-tighter">Something went wrong</h1>
            <p className="text-white/50 text-sm leading-relaxed">
              An unexpected error occurred. Please refresh the page. If this persists, contact{' '}
              <a href="mailto:support@vexoritsolutions.site" className="text-secondary hover:underline">
                support@vexoritsolutions.site
              </a>
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 rounded-2xl bg-secondary text-black text-xs font-black uppercase tracking-widest hover:bg-white transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
