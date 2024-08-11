import { useEffect, useState } from 'react';
import {
  Avatar,
  Tooltip,
} from '@nextui-org/react';
import {
  FiHome,
  FiSettings,
  FiBarChart,
  FiMessageCircle
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { CgMenuRightAlt } from "react-icons/cg";
import { Popover } from "antd";
import { MdLogout } from "react-icons/md";
import { IoIosPerson } from "react-icons/io";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { toggleSidebar } from '../../Redux/ProfileSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../Redux/Store';
import { setIsCollapsed } from '../../Redux/ProfileSlice';
import { useAuth } from '../../Secure/AuthContext';
import { useNavigate } from 'react-router-dom';
const RightSidebar = () => {
  const { handleLogout } = useAuth()
  const dispatch = useDispatch();
  const isCollapsed = useSelector((state: RootState) => state.profile.isCollapsed);
  const [activeItem, setActiveItem] = useState('Home');
  const navigate = useNavigate()

  const togglebar = () => {
    dispatch(toggleSidebar());
  };
  const menuItems = [
    { icon: <FiHome size={24} />, label: 'Home' },
    { icon: <IoIosPerson size={24} />, label: 'Profile' },
    { icon: <FiBarChart size={24} />, label: 'Projects' },
    { icon: <FiMessageCircle size={24} />, label: 'Messages' },
    { icon: <FiSettings size={24} />, label: 'Settings' },
    { icon: <IoMdHelpCircleOutline size={24} />, label: 'Help or Support' },
  ];
  const handleTabChange = (label: string) => {
    setActiveItem(label);
    navigate(`/home/${label.toLocaleLowerCase()}`)
  };
  useEffect(() => {
    //set to setIsCollapsed true when window width is less than 768px
    const handleResize = () => {
      if (window.innerWidth < 768) {
        dispatch(setIsCollapsed(true));
      } else {
        dispatch(setIsCollapsed(false));
      }
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [dispatch])

  return (
    <motion.div
      className="fixed left-0 top-0 h-screen flex flex-col bg-white dark:bg-gray-800 shadow-lg z-50 overflow-hidden"
      animate={{ width: isCollapsed ? '4rem' : '12rem' }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex justify-end">
        <button
          onClick={togglebar}
          className="dark:text-gray-300 p-4"
        >
          <CgMenuRightAlt size={20} />
        </button>
      </div>

      <div className="flex-grow flex flex-col gap-3 items-center px-2 py-4">
        {menuItems.map((item, index) => (
          <Tooltip
            key={index}
            content={item.label}
            placement="right"
            isDisabled={!isCollapsed}
          >
            <button
              className={`
          flex items-center p-2 dark:text-gray-300 
          rounded-xl
          ${isCollapsed ? 'justify-center w-12 h-12' : 'justify-start w-full h-12'}
          ${activeItem === item.label
                  ? 'bg-primary text-white dark:bg-primary dark:text-white'
                  : ' hover:bg-gray-100 dark:hover:bg-gray-700 '
                }
        `}
              onClick={() => handleTabChange(item.label)}
            >
              <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start w-full'}`}>
                <span>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="ml-3 font-medium whitespace-nowrap transition-opacity duration-200">
                    {item.label}
                  </span>
                )}
              </div>
            </button>
          </Tooltip>
        ))}
      </div>

      <div className='flex justify-between  bg-gray-600 py-2 px-4'>
        <div className={`flex items-center  ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
          <Avatar
            size="sm"
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
            className="border-2 border-primary"
          />
          {!isCollapsed && (
            <div className="ml-3 overflow-hidden">
              <p className="font-semibold dark:text-gray-300 whitespace-nowrap">John Doe</p>

            </div>
          )}
        </div>
        {!isCollapsed && (
          <Popover
            content={
              <div className="flex items-center gap-2 text-blue-500" onClick={(handleLogout)}>
                <MdLogout />
                <span>Logout</span>
              </div>
            }
            placement="topRight"
            trigger="click"
          >
            <button className="text-blue-500">
              <MdLogout />
            </button>
          </Popover>
        )}
      </div>
    </motion.div>
  );
};

export default RightSidebar;