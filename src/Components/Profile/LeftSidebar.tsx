import { useEffect, useMemo, useState } from 'react';
import { Avatar, Tooltip } from '@nextui-org/react';
import { Settings, MessageCircle, Menu, LogOut, User, Code2, X } from 'lucide-react';
import { GiSkills } from 'react-icons/gi';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleSidebar } from '../../Redux/ProfileSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../Redux/Store';
import { setIsCollapsed } from '../../Redux/ProfileSlice';
import { useAuth } from '../../Secure/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_USER_DATA } from '../../GraphQL/Queries/Profile/Users';

const LeftSidebar = () => {
  const { handleLogout } = useAuth();
  const dispatch = useDispatch();
  const { data } = useQuery(GET_USER_DATA);
  const isCollapsed = useSelector((state: RootState) => state.profile.isCollapsed);
  const [activeItem, setActiveItem] = useState('Profile');
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const togglebar = () => {
    dispatch(toggleSidebar());
  };

  const menuItems = useMemo(
    () => [
      { icon: <User size={20} />, label: 'Profile', path: data?.user?.username || 'profile' },
      { icon: <Code2 size={20} />, label: 'Projects', path: 'projects' },
      { icon: <GiSkills size={20} />, label: 'Skills', path: 'skills' },
      { icon: <MessageCircle size={20} />, label: 'Messages', path: 'messages' },
      { icon: <Settings size={20} />, label: 'Settings', path: 'settings' },
    ],
    [data?.user?.username]
  );

  const handleTabChange = (item: (typeof menuItems)[0]) => {
    setActiveItem(item.label);
    navigate(`/home/${item.path}`);
  };

  useEffect(() => {
    const currentPath = location.pathname.split('/').pop()?.toLowerCase();
    const activeMenuItem = menuItems.find(
      item =>
        item.path.toLowerCase() === currentPath ||
        (item.label.toLowerCase() === 'profile' &&
          currentPath === data?.user?.username?.toLowerCase())
    );
    if (activeMenuItem) {
      setActiveItem(activeMenuItem.label);
    }
  }, [location, menuItems, data?.user?.username]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        dispatch(setIsCollapsed(true));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dispatch]);

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        className={`
          fixed left-0 top-0 h-screen flex flex-col z-50 overflow-hidden
          bg-slate-900/98 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl
          ${isMobile && !isCollapsed ? 'shadow-2xl' : ''}
        `}
        initial={false}
        animate={{
          width: isCollapsed ? '4rem' : '16rem',
          x: isMobile && isCollapsed ? '-100%' : '0%',
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
          type: 'tween',
        }}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50 min-h-[4rem]">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <span className="font-bold text-white text-lg">DevCollab</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglebar}
            className={`
              p-2 text-slate-400 hover:text-white transition-all duration-200 
              rounded-lg hover:bg-slate-800/50 active:bg-slate-700/50
              ${isCollapsed ? 'mx-auto' : ''}
            `}
          >
            {isMobile && !isCollapsed ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
        <nav className="flex-grow flex flex-col gap-2 px-3 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent overflow-hidden">
          {menuItems.map((item, index) => (
            <Tooltip
              key={index}
              content={item.label}
              placement="right"
              isDisabled={!isCollapsed}
              delay={500}
            >
              <motion.button
                whileHover={{
                  scale: 1.02,
                  x: isCollapsed ? 0 : 4,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative flex items-center p-3 rounded-xl transition-all duration-200 group
                  ${isCollapsed ? 'justify-center w-12 h-12 mx-auto' : 'justify-start w-full h-12'}
                  ${
                    activeItem === item.label
                      ? 'bg-gradient-to-r from-purple-500/25 to-pink-500/25 border border-purple-500/40 text-white shadow-lg shadow-purple-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-slate-600/30'
                  }
                `}
                onClick={() => handleTabChange(item)}
              >
                <div
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start w-full'}`}
                >
                  <span
                    className={`
                      ${activeItem === item.label ? 'text-purple-400' : ''} 
                      group-hover:scale-110 transition-all duration-200
                      ${activeItem === item.label ? 'drop-shadow-sm' : ''}
                    `}
                  >
                    {item.icon}
                  </span>
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="ml-3 font-medium whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence mode="wait">
                  {!isCollapsed && activeItem === item.label && (
                    <motion.div
                      layoutId="activeIndicator"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-sm"
                    />
                  )}
                </AnimatePresence>

                {activeItem === item.label && (
                  <motion.div
                    layoutId="activeBackground"
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            </Tooltip>
          ))}
        </nav>

        <div className="border-t border-slate-700/50 p-4 mt-auto">
          <div
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}
          >
            <div
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}
            >
              <motion.div whileHover={{ scale: 1.05 }} className="relative">
                <Avatar
                  size={isCollapsed ? 'sm' : 'md'}
                  src={data?.user?.profilePicture}
                  className="border-2 border-purple-500/50 shadow-lg shadow-purple-500/20 transition-all duration-200"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
              </motion.div>

              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="ml-3 overflow-hidden flex-1 min-w-0"
                  >
                    <p className="font-semibold text-white text-sm truncate">
                      {data?.user?.name || data?.user?.username || 'User'}
                    </p>
                    <p className="text-slate-400 text-xs truncate">
                      @{data?.user?.username || 'username'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-400 transition-all duration-200 rounded-lg hover:bg-red-500/10 hover:border-red-500/20 border border-transparent"
                  title="Logout"
                >
                  <LogOut size={16} />
                </motion.button>
              )}
            </AnimatePresence>

            {isCollapsed && (
              <Tooltip content="Logout" placement="right" delay={500}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleLogout}
                  className="absolute bottom-2 right-2 p-2 text-slate-400 hover:text-red-400 transition-all duration-200 rounded-lg hover:bg-red-500/10"
                  title="Logout"
                >
                  <LogOut size={14} />
                </motion.button>
              </Tooltip>
            )}
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};

export default LeftSidebar;
