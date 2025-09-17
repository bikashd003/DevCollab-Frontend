import { useEffect, useMemo, useState } from 'react';
import { Avatar, Tooltip } from '@nextui-org/react';
import { Settings, MessageCircle, Menu, LogOut, User, HelpCircle, Code2, Zap } from 'lucide-react';
import { GiSkills } from 'react-icons/gi';
import { motion } from 'framer-motion';
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
      { icon: <HelpCircle size={20} />, label: 'Help', path: 'help' },
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
      if (window.innerWidth < 768) {
        dispatch(setIsCollapsed(true));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dispatch]);

  return (
    <motion.div
      className="fixed left-0 top-0 h-screen flex flex-col bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl z-50 overflow-hidden"
      animate={{ width: isCollapsed ? '4rem' : '16rem' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">DevCollab</span>
          </motion.div>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglebar}
          className="p-2 text-slate-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-slate-800/50"
        >
          <Menu size={20} />
        </motion.button>
      </div>

      <div className="flex-grow flex flex-col gap-2 px-3 py-6">
        {menuItems.map((item, index) => (
          <Tooltip key={index} content={item.label} placement="right" isDisabled={!isCollapsed}>
            <motion.button
              whileHover={{ scale: 1.02, x: 2 }}
              whileTap={{ scale: 0.98 }}
              className={`
                flex items-center p-3 rounded-xl transition-all duration-200 group
                ${isCollapsed ? 'justify-center w-12 h-12' : 'justify-start w-full h-12'}
                ${
                  activeItem === item.label
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white shadow-lg shadow-purple-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                }
              `}
              onClick={() => handleTabChange(item)}
            >
              <div
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start w-full'}`}
              >
                <span
                  className={`${activeItem === item.label ? 'text-purple-400' : ''} group-hover:scale-110 transition-transform duration-200`}
                >
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-3 font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </div>
              {!isCollapsed && activeItem === item.label && (
                <motion.div
                  layoutId="activeIndicator"
                  className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                />
              )}
            </motion.button>
          </Tooltip>
        ))}
      </div>

      <div className="border-t border-slate-700/50 p-4">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
            <Avatar
              size="sm"
              src={data?.user?.profilePicture}
              className="border-2 border-purple-500/50 shadow-lg shadow-purple-500/20"
            />
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-3 overflow-hidden"
              >
                <p className="font-semibold text-white text-sm truncate">
                  {data?.user?.name || data?.user?.username || 'User'}
                </p>
                <p className="text-slate-400 text-xs truncate">
                  @{data?.user?.username || 'username'}
                </p>
              </motion.div>
            )}
          </div>
          {!isCollapsed && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 transition-colors duration-200 rounded-lg hover:bg-slate-800/50"
              title="Logout"
            >
              <LogOut size={16} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LeftSidebar;
