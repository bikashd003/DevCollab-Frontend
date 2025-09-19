import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}

const PageContainer = ({
  children,
  className = '',
  maxWidth = '6xl',
  padding = 'lg',
}: PageContainerProps) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-4 sm:p-6 lg:p-8',
    xl: 'p-6 sm:p-8 lg:p-12',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`min-h-screen ${paddingClasses[padding]} ${className}`}
    >
      <div className={`${maxWidthClasses[maxWidth]} mx-auto`}>{children}</div>
    </motion.div>
  );
};

export default PageContainer;
