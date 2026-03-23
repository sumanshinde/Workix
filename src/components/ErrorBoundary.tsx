'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // In production, log to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Something went wrong</h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              An unexpected error occurred. Our team has been notified and is working on a fix.
            </p>
            <div className="pt-4 flex items-center gap-3 justify-center">
              <Button 
                onClick={() => window.location.reload()}
                className="rounded-xl shadow-lg shadow-blue-500/20"
                leftIcon={<RefreshCw size={18} />}
              >
                Reload Page
              </Button>
              <Button 
                variant="ghost"
                onClick={() => this.setState({ hasError: false })}
                className="text-slate-400 font-bold"
              >
                Try Again
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-slate-50 rounded-xl text-left overflow-auto max-h-40">
                <code className="text-xs text-red-500 font-mono">
                  {this.state.error?.message}
                </code>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
