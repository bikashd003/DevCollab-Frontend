import React from 'react';
import { FiAlertTriangle, FiChevronLeft, FiRefreshCw } from 'react-icons/fi';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';

const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage: string;
  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'Unknown error';
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-xl w-full border border-gray-700">
        <div className="flex flex-col items-center">
          <FiAlertTriangle className="text-yellow-500 text-4xl mb-4" />
          <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-400 text-center mb-4">
            We encountered an error while loading this page.
          </p>
          <div className="w-full mb-4 bg-gray-900 rounded-lg p-3 overflow-hidden">
            <pre className="text-green-400 font-mono text-sm overflow-x-auto">
              <code>{errorMessage}</code>
            </pre>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded transition duration-300 ease-in-out flex items-center text-sm"
            >
              <FiChevronLeft className="mr-1" /> Go Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded transition duration-300 ease-in-out flex items-center text-sm"
            >
              <FiRefreshCw className="mr-1" /> Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteErrorBoundary;
