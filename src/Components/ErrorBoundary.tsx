import React from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-2xl w-full border border-gray-700">
            <div className="flex flex-col items-center">
              <FiAlertTriangle className="text-yellow-500 text-6xl mb-6" />
              <h1 className="text-3xl font-bold mb-4">Oops! Something went wrong</h1>
              <p className="text-gray-400 text-center mb-6">
                We&apos;ve encountered an unexpected error. Please try refreshing the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center"
              >
                <FiRefreshCw className="mr-2" /> Refresh Page
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
