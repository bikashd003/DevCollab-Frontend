import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Avatar } from '@nextui-org/react';
import { useQuery } from '@apollo/client';
import { GET_USER_DATA } from '../../GraphQL/Queries/Profile/Users';
import { toggleSidebar } from '../../Redux/ProfileSlice';

const TopBar = () => {
  const dispatch = useDispatch();
  const { data } = useQuery(GET_USER_DATA);

  const toggleSidebarHandler = () => {
    dispatch(toggleSidebar());
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 md:hidden"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebarHandler}
            className="p-2 text-slate-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-slate-800/50"
          >
            <Menu size={20} />
          </motion.button>
        </div>

        <div className="flex items-center gap-3">
          <Avatar
            size="sm"
            src={data?.user?.profilePicture}
            className="border-2 border-purple-500/50"
          />
        </div>
      </div>
    </motion.header>
  );
};

export default TopBar;
