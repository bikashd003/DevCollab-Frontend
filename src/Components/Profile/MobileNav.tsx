import { motion, AnimatePresence } from 'framer-motion';
import { User, Code2, MessageCircle, Settings } from 'lucide-react';
import { GiSkills } from 'react-icons/gi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_USER_DATA } from '../../GraphQL/Queries/Profile/Users';
import { useMemo } from 'react';

interface MobileNavProps {
  isVisible: boolean;
}

const MobileNav = ({ isVisible }: MobileNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = useQuery(GET_USER_DATA);

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

  const handleNavigation = (path: string) => {
    navigate(`/home/${path}`);
  };

  const getActiveItem = () => {
    const currentPath = location.pathname.split('/').pop()?.toLowerCase();
    return (
      menuItems.find(
        item =>
          item.path.toLowerCase() === currentPath ||
          (item.label.toLowerCase() === 'profile' &&
            currentPath === data?.user?.username?.toLowerCase())
      )?.label || 'Profile'
    );
  };

  const activeItem = getActiveItem();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 md:hidden"
        >
          <div className="flex items-center justify-around px-4 py-2 safe-area-pb">
            {menuItems.slice(0, 5).map((item, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation(item.path)}
                className={`
                  flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200
                  ${
                    activeItem === item.label
                      ? 'text-purple-400 bg-purple-500/10'
                      : 'text-slate-400 hover:text-white'
                  }
                `}
              >
                <div
                  className={`${activeItem === item.label ? 'scale-110' : ''} transition-transform duration-200`}
                >
                  {item.icon}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
                {activeItem === item.label && (
                  <motion.div
                    layoutId="mobileActiveIndicator"
                    className="w-1 h-1 bg-purple-400 rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
