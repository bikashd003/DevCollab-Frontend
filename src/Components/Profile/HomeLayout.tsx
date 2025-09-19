import { Outlet, ScrollRestoration } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../Redux/Store';
import LeftSidebar from './LeftSidebar';
import TopBar from './TopBar';
import MobileNav from './MobileNav';
import { useEffect } from 'react';
import { setIsCollapsed } from '../../Redux/ProfileSlice';
import useResponsive from '../../Hooks/useResponsive';

const HomeLayout = () => {
  const dispatch = useDispatch();
  const isCollapsed = useSelector((state: RootState) => state.profile.isCollapsed);
  const { isMobile } = useResponsive();

  useEffect(() => {
    if (isMobile) {
      dispatch(setIsCollapsed(true));
    }
  }, [isMobile, dispatch]);

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-mono relative">
      <div
        className="fixed inset-0 opacity-3"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-500/8 to-cyan-500/8 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500/8 to-teal-500/8 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>
      <div className="relative z-10 min-h-screen">
        <LeftSidebar />

        {isMobile && <TopBar />}

        {isMobile && !isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => dispatch(setIsCollapsed(true))}
          />
        )}

        <motion.main
          className={`
            min-h-screen transition-all duration-300 ease-in-out relative z-30
            ${isMobile ? 'ml-0 pt-16 pb-20' : isCollapsed ? 'ml-16' : 'ml-64'}
          `}
          layout
        >
          <div className="relative z-10 min-h-screen">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </div>
        </motion.main>

        <MobileNav isVisible={isMobile} />
      </div>

      <ScrollRestoration />
    </div>
  );
};

export default HomeLayout;
