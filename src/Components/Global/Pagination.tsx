import React from 'react';
import { motion } from 'framer-motion';
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiMoreHorizontal,
} from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
  showQuickJump?: boolean;
  showPageInfo?: boolean;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  onItemsPerPageChange,
  itemsPerPageOptions = [5, 10, 20, 50],
  showQuickJump = true,
  showPageInfo = true,
  className = '',
}) => {
  // Generate visible page numbers
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Calculate start and end page numbers
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, currentPage + delta);

    // Adjust start and end to always show enough pages
    if (end - start < delta * 2) {
      if (start === 1) {
        end = Math.min(totalPages, start + delta * 2);
      } else {
        start = Math.max(1, end - delta * 2);
      }
    }

    // Generate the range
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Add first page and dots if needed
    if (start > 1) {
      rangeWithDots.push(1);
      if (start > 2) {
        rangeWithDots.push('...');
      }
    }

    // Add the main range
    rangeWithDots.push(...range);

    // Add last page and dots if needed
    if (end < totalPages) {
      if (end < totalPages - 1) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page);
    }
  };

  const PaginationButton: React.FC<{
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    active?: boolean;
    variant?: 'default' | 'control' | 'dots';
    'aria-label'?: string;
  }> = ({
    children,
    onClick,
    disabled = false,
    active = false,
    variant = 'default',
    'aria-label': ariaLabel,
  }) => {
    const baseClasses =
      'relative inline-flex items-center justify-center transition-all duration-200 font-medium text-sm';

    let variantClasses = '';
    let hoverClasses = '';
    let activeClasses = '';

    switch (variant) {
      case 'control':
        variantClasses = 'w-10 h-10 rounded-xl border-2';
        hoverClasses = disabled
          ? 'cursor-not-allowed opacity-40'
          : 'hover:scale-105 hover:shadow-lg';
        activeClasses = disabled
          ? 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-800'
          : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20';
        break;
      case 'dots':
        variantClasses = 'w-10 h-10 rounded-xl';
        hoverClasses = '';
        activeClasses = 'text-gray-400 dark:text-gray-600 cursor-default';
        break;
      default:
        variantClasses = 'w-10 h-10 rounded-xl border-2';
        hoverClasses = 'hover:scale-105 hover:shadow-lg';
        activeClasses = active
          ? 'border-blue-500 dark:border-blue-400 bg-blue-500 dark:bg-blue-600 text-white shadow-lg'
          : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20';
    }

    return (
      <motion.button
        whileHover={!disabled && variant !== 'dots' ? { scale: 1.05 } : {}}
        whileTap={!disabled && variant !== 'dots' ? { scale: 0.95 } : {}}
        className={`${baseClasses} ${variantClasses} ${hoverClasses} ${activeClasses}`}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
      >
        {children}
      </motion.button>
    );
  };

  if (totalPages <= 1) return null;

  // Calculate items info for advanced pagination
  const startItem = totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : null;
  const endItem =
    totalItems && itemsPerPage ? Math.min(currentPage * itemsPerPage, totalItems) : null;

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Items Per Page Selector - Only show if handler is provided */}
      {onItemsPerPageChange && totalItems && itemsPerPage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400"
        >
          <span className="hidden sm:inline">Show</span>
          <select
            value={itemsPerPage}
            onChange={e => onItemsPerPageChange(parseInt(e.target.value))}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="hidden sm:inline">items per page</span>
        </motion.div>
      )}

      {/* Main Pagination - Responsive Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between w-full max-w-4xl"
      >
        {/* Desktop/Tablet View */}
        <div className="hidden sm:flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-3 shadow-lg mx-auto">
          {/* First Page Button */}
          {showQuickJump && (
            <PaginationButton
              onClick={() => handlePageClick(1)}
              disabled={currentPage === 1}
              variant="control"
              aria-label="Go to first page"
            >
              <FiChevronsLeft size={16} />
            </PaginationButton>
          )}

          {/* Previous Button */}
          <PaginationButton
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
            variant="control"
            aria-label="Go to previous page"
          >
            <FiChevronLeft size={16} />
          </PaginationButton>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {visiblePages.map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <PaginationButton variant="dots">
                    <FiMoreHorizontal size={16} />
                  </PaginationButton>
                ) : (
                  <PaginationButton
                    onClick={() => handlePageClick(page)}
                    active={page === currentPage}
                    aria-label={`Go to page ${page}`}
                  >
                    {page}
                  </PaginationButton>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next Button */}
          <PaginationButton
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="control"
            aria-label="Go to next page"
          >
            <FiChevronRight size={16} />
          </PaginationButton>

          {/* Last Page Button */}
          {showQuickJump && (
            <PaginationButton
              onClick={() => handlePageClick(totalPages)}
              disabled={currentPage === totalPages}
              variant="control"
              aria-label="Go to last page"
            >
              <FiChevronsRight size={16} />
            </PaginationButton>
          )}
        </div>

        {/* Mobile View - Compact Design */}
        <div className="flex sm:hidden items-center justify-between w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-3 shadow-lg">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <FiChevronLeft size={16} />
            <span>Prev</span>
          </motion.button>

          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">Page</span>
            <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
              {currentPage}
            </span>
            <span className="text-gray-600 dark:text-gray-400">of</span>
            <span className="font-bold text-gray-900 dark:text-gray-100">{totalPages}</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <span>Next</span>
            <FiChevronRight size={16} />
          </motion.button>
        </div>
      </motion.div>

      {/* Page Info - Responsive */}
      {showPageInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-600 dark:text-gray-400"
        >
          {/* Show detailed info if totalItems and itemsPerPage are provided */}
          {totalItems && itemsPerPage && startItem && endItem ? (
            <>
              <div className="bg-gray-100/80 dark:bg-gray-700/80 px-4 py-2 rounded-full backdrop-blur-sm">
                <span className="hidden sm:inline">Showing </span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{startItem}</span>
                <span className="hidden sm:inline"> to </span>
                <span className="sm:hidden">-</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{endItem}</span>
                <span className="hidden sm:inline"> of </span>
                <span className="sm:hidden">/</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{totalItems}</span>
                <span className="hidden sm:inline"> results</span>
              </div>
              <div className="bg-gray-100/80 dark:bg-gray-700/80 px-4 py-2 rounded-full backdrop-blur-sm sm:hidden">
                Page{' '}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {currentPage}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-blue-600 dark:text-blue-400">{totalPages}</span>
              </div>
            </>
          ) : (
            <div className="bg-gray-100/80 dark:bg-gray-700/80 px-4 py-2 rounded-full backdrop-blur-sm">
              Page{' '}
              <span className="font-semibold text-blue-600 dark:text-blue-400">{currentPage}</span>{' '}
              of{' '}
              <span className="font-semibold text-blue-600 dark:text-blue-400">{totalPages}</span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Pagination;
