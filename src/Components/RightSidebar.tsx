import { useState } from 'react';
import { 
  Button, 
  Avatar, 
  Tooltip, 
} from '@nextui-org/react';
import { 
  FiMenu, 
  FiHome, 
  FiSettings, 
  FiBox, 
  FiBarChart, 
  FiMessageCircle 
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const RightSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('Home');

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { icon: <FiHome size={24} />, label: 'Home' },
    { icon: <FiBox size={24} />, label: 'Products' },
    { icon: <FiBarChart size={24} />, label: 'Analytics' },
    { icon: <FiMessageCircle size={24} />, label: 'Messages' },
    { icon: <FiSettings size={24} />, label: 'Settings' },
  ];

  return (
    <motion.div 
      className="fixed left-0 top-0 h-screen flex flex-col bg-white dark:bg-gray-800 shadow-lg z-50 overflow-hidden"
      animate={{ width: isCollapsed ? '4rem' : '12rem' }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex justify-end">
        <button
          onClick={toggleSidebar}
          className="dark:text-gray-300"
        >
          <FiMenu size={16} />
        </button>
      </div>

      <div className="flex-grow flex flex-col gap-2 items-center px-2">
        {menuItems.map((item, index) => (
          <Tooltip
            key={index}
            content={item.label}
            placement="right"
            isDisabled={!isCollapsed}
          >
            <Button
              className={`flex items-center w-[150px] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ${
                isCollapsed ? 'justify-center' : 'justify-start'
              } ${
                activeItem === item.label ? 'bg-primary text-white dark:bg-primary dark:text-white hover:bg-primary-dark dark:hover:bg-primary-dark' : ''
              }`}
              onClick={() => setActiveItem(item.label)}
            >
              {item.icon}
              {!isCollapsed && (
                <span className="ml-3 whitespace-nowrap">{item.label}</span>
              )}
            </Button>
          </Tooltip>
        ))}
      </div>

      <div className={`flex items-center p-4 ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
        <Avatar
          size="sm"
          src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
          className="border-2 border-primary"
        />
        {!isCollapsed && (
          <div className="ml-3 overflow-hidden">
            <p className="font-semibold dark:text-gray-300 whitespace-nowrap">John Doe</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">Admin</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RightSidebar;