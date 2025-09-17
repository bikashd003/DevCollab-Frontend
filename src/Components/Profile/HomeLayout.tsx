import { Outlet, ScrollRestoration } from 'react-router-dom';
import { motion } from 'framer-motion';
import LeftSidebar from './LeftSidebar';
import AuthRedirectHandler from '../Auth/AuthRedirectHandler';

const HomeLayout = () => {
  // Floating elements similar to DevCollabHome
  const floatingElements = Array.from({ length: 15 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute text-slate-400/10 dark:text-slate-600/10 pointer-events-none"
      initial={{
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
      }}
      animate={{
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
        rotate: 360,
      }}
      transition={{
        duration: Math.random() * 25 + 15,
        repeat: Infinity,
        repeatType: 'reverse',
      }}
    >
      {['{', '}', '()', '[]', '<>', '/>', '&&', '||', '=>', '++'][Math.floor(Math.random() * 10)]}
    </motion.div>
  ));

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-mono">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden">{floatingElements}</div>

      {/* Grid background */}
      <div
        className="fixed inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Gradient orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse delay-2000" />

      <div className="flex relative z-10">
        <AuthRedirectHandler />
        <LeftSidebar />
        <div className="flex-grow">
          <Outlet />
        </div>
      </div>
      <ScrollRestoration />
    </div>
  );
};

export default HomeLayout;
