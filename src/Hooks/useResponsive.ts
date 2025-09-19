import { useState, useEffect, useMemo } from 'react';

interface BreakpointConfig {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

const defaultBreakpoints: BreakpointConfig = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const useResponsive = (breakpoints?: Partial<BreakpointConfig>) => {
  const config = useMemo(
    () => ({
      ...defaultBreakpoints,
      ...(breakpoints || {}),
    }),
    [breakpoints]
  );

  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  const [currentBreakpoint, setCurrentBreakpoint] = useState<keyof BreakpointConfig>('lg');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setScreenSize({ width, height });

      // Determine current breakpoint
      if (width >= config['2xl']) {
        setCurrentBreakpoint('2xl');
      } else if (width >= config.xl) {
        setCurrentBreakpoint('xl');
      } else if (width >= config.lg) {
        setCurrentBreakpoint('lg');
      } else if (width >= config.md) {
        setCurrentBreakpoint('md');
      } else {
        setCurrentBreakpoint('sm');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [config]);

  const isMobile = screenSize.width < config.md;
  const isTablet = screenSize.width >= config.md && screenSize.width < config.lg;
  const isDesktop = screenSize.width >= config.lg;
  const isLargeDesktop = screenSize.width >= config.xl;

  const isBreakpoint = (breakpoint: keyof BreakpointConfig) => {
    return screenSize.width >= config[breakpoint];
  };

  const isBetween = (min: keyof BreakpointConfig, max: keyof BreakpointConfig) => {
    return screenSize.width >= config[min] && screenSize.width < config[max];
  };

  return {
    screenSize,
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isBreakpoint,
    isBetween,
    breakpoints: config,
  };
};

export default useResponsive;
