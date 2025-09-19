import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  DropdownSection,
} from '@nextui-org/react';
import { useTheme } from '../../Context/ThemeProvider';
import {
  RiMoonLine,
  RiSunLine,
  RiLogoutBoxLine,
  RiSettings3Line,
  RiUser3Line,
  RiCodeLine,
  RiMenu3Line,
} from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setIsModalOpen } from '../../Redux/OvarallSlice';
import type { RootState } from '../../Redux/Store';
import AuthenticateModal from '../Modal/AuthenticateModal';
import { useAuth } from '../../Secure/AuthContext';
import { useQuery } from '@apollo/client';
import { GET_USER_DATA } from '../../GraphQL/Queries/Profile/Users';

const Nav = () => {
  const { isAuthenticated, handleLogout } = useAuth();
  const dispatch = useDispatch();
  const { data } = useQuery(GET_USER_DATA);
  const isModalOpen = useSelector((state: RootState) => state.overall.isModalOpen);
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = ['Home', 'About', 'Questions', 'Blogs', 'Editor'];
  const userMenuItems = [
    {
      key: 'profile',
      icon: RiUser3Line,
      label: 'Profile',
      desc: 'Manage account',
      path: `/home/${data?.user?.username}`,
      color: 'blue',
    },
    {
      key: 'settings',
      icon: RiSettings3Line,
      label: 'Settings',
      desc: 'Preferences',
      path: '/home/settings',
      color: 'gray',
    },
  ];

  const animations = {
    menu: { open: { opacity: 1, y: 0, scale: 1 }, closed: { opacity: 0, y: -20, scale: 0.95 } },
    item: { hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 } },
  };

  const handleSignUpClick = () => !isAuthenticated && dispatch(setIsModalOpen(true));
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <div className="fixed top-2 left-1/2 transform -translate-x-1/2 z-50 w-[96%] max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="backdrop-blur-md bg-white/60 dark:bg-gray-950/70 border border-white/10 dark:border-gray-800/30 rounded-2xl shadow-2xl shadow-black/5 dark:shadow-black/20"
        >
          <Navbar
            isBlurred={false}
            className="bg-transparent font-sans px-3 py-0 min-h-[3.5rem]"
            maxWidth="full"
          >
            <NavbarBrand>
              <motion.p
                className="font-bold text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer tracking-tight"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/')}
              >
                DevCollab
              </motion.p>
            </NavbarBrand>

            <NavbarContent className="hidden md:flex gap-8" justify="center">
              {navItems.map((item, index) => (
                <NavbarItem key={item}>
                  <motion.div
                    variants={animations.item}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.05 }}
                  >
                    {item === 'Editor' ? (
                      <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative group"
                      >
                        <Link to="/editor">
                          <button className="flex p-px gap-3 cursor-pointer text-white font-semibold bg-gradient-to-r from-gray-800 to-black px-4 py-1 rounded-full border border-gray-600 hover:text-gray-500 hover:border-gray-800 hover:from-black hover:to-gray-900">
                            <RiCodeLine className="text-xl" />
                            Editor
                          </button>
                        </Link>
                      </motion.div>
                    ) : (
                      <Link
                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium relative group text-sm"
                        to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                      >
                        {item}
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-200 rounded-full"></span>
                      </Link>
                    )}
                  </motion.div>
                </NavbarItem>
              ))}
            </NavbarContent>

            <NavbarContent justify="end" className="gap-2">
              <NavbarItem className="hidden lg:flex"></NavbarItem>

              <NavbarItem className="hidden lg:flex">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={isAuthenticated ? 'hidden' : ''}
                >
                  <button
                    className="group relative dark:bg-neutral-800 bg-neutral-200 rounded-full p-px overflow-hidden"
                    onClick={handleSignUpClick}
                  >
                    <span className="absolute inset-0 rounded-full overflow-hidden">
                      <span className="inset-0 absolute pointer-events-none select-none">
                        <span
                          className="block -translate-x-1/2 -translate-y-1/3 size-24 blur-xl"
                          style={{
                            background:
                              'linear-gradient(135deg, rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))',
                          }}
                        />
                      </span>
                    </span>
                    <span
                      className="inset-0 absolute pointer-events-none select-none"
                      style={{
                        animation:
                          '10s ease-in-out 0s infinite alternate none running border-glow-translate',
                      }}
                    >
                      <span
                        className="block z-0 h-full w-12 blur-xl -translate-x-1/2 rounded-full"
                        style={{
                          animation:
                            '10s ease-in-out 0s infinite alternate none running border-glow-scale',
                          background:
                            'linear-gradient(135deg, rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))',
                        }}
                      />
                    </span>
                    <span className="flex items-center justify-center gap-1 relative z-[1] dark:bg-neutral-950/90 bg-neutral-50/90 rounded-full py-2 px-4 pl-2 w-full">
                      <span className="relative group-hover:scale-105 transition-transform group-hover:rotate-[360deg] duration-500">
                        <svg
                          width={18}
                          height={18}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="opacity-80 dark:opacity-100"
                          style={{
                            animation:
                              '14s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0s infinite alternate none running star-rotate',
                          }}
                        >
                          <path
                            d="M11.5268 2.29489C11.5706 2.20635 11.6383 2.13183 11.7223 2.07972C11.8062 2.02761 11.903 2 12.0018 2C12.1006 2 12.1974 2.02761 12.2813 2.07972C12.3653 2.13183 12.433 2.20635 12.4768 2.29489L14.7868 6.97389C14.939 7.28186 15.1636 7.5483 15.4414 7.75035C15.7192 7.95239 16.0419 8.08401 16.3818 8.13389L21.5478 8.88989C21.6457 8.90408 21.7376 8.94537 21.8133 9.00909C21.8889 9.07282 21.9452 9.15644 21.9758 9.2505C22.0064 9.34456 22.0101 9.4453 21.9864 9.54133C21.9627 9.63736 21.9126 9.72485 21.8418 9.79389L18.1058 13.4319C17.8594 13.672 17.6751 13.9684 17.5686 14.2955C17.4622 14.6227 17.4369 14.9708 17.4948 15.3099L18.3768 20.4499C18.3941 20.5477 18.3835 20.6485 18.3463 20.7406C18.3091 20.8327 18.2467 20.9125 18.1663 20.9709C18.086 21.0293 17.9908 21.0639 17.8917 21.0708C17.7926 21.0777 17.6935 21.0566 17.6058 21.0099L12.9878 18.5819C12.6835 18.4221 12.345 18.3386 12.0013 18.3386C11.6576 18.3386 11.3191 18.4221 11.0148 18.5819L6.3978 21.0099C6.31013 21.0563 6.2112 21.0772 6.11225 21.0701C6.0133 21.0631 5.91832 21.0285 5.83809 20.9701C5.75787 20.9118 5.69563 20.8321 5.65846 20.7401C5.62128 20.6482 5.61066 20.5476 5.6278 20.4499L6.5088 15.3109C6.567 14.9716 6.54178 14.6233 6.43534 14.2959C6.32889 13.9686 6.14441 13.672 5.8978 13.4319L2.1618 9.79489C2.09039 9.72593 2.03979 9.63829 2.01576 9.54197C1.99173 9.44565 1.99524 9.34451 2.02588 9.25008C2.05652 9.15566 2.11307 9.07174 2.18908 9.00788C2.26509 8.94402 2.3575 8.90279 2.4558 8.88889L7.6208 8.13389C7.96106 8.08439 8.28419 7.95295 8.56238 7.75088C8.84058 7.54881 9.0655 7.28216 9.2178 6.97389L11.5268 2.29489Z"
                            fill="url(#paint0_linear_171_8212)"
                            stroke="url(#paint1_linear_171_8212)"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <defs>
                            <linearGradient
                              id="paint0_linear_171_8212"
                              x1="-0.5"
                              y1={9}
                              x2="15.5"
                              y2="-1.5"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#7A69F9" />
                              <stop offset="0.575" stopColor="#F26378" />
                              <stop offset={1} stopColor="#F5833F" />
                            </linearGradient>
                            <linearGradient
                              id="paint1_linear_171_8212"
                              x1="-0.5"
                              y1={9}
                              x2="15.5"
                              y2="-1.5"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#7A69F9" />
                              <stop offset="0.575" stopColor="#F26378" />
                              <stop offset={1} stopColor="#F5833F" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <span
                          className="rounded-full size-11 absolute opacity-0 dark:opacity-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-lg"
                          style={{
                            animation:
                              '14s ease-in-out 0s infinite alternate none running star-shine',
                            background:
                              'linear-gradient(135deg, rgb(59, 196, 242), rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))',
                          }}
                        />
                      </span>
                      <span className="bg-gradient-to-b ml-1.5 dark:from-white dark:to-white/50 from-neutral-950 to-neutral-950/50 bg-clip-text text-xs text-transparent group-hover:scale-105 transition transform-gpu">
                        Sign Up
                      </span>
                    </span>
                  </button>
                </motion.div>
              </NavbarItem>

              {isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Dropdown
                    placement="bottom-end"
                    classNames={{
                      content:
                        'backdrop-blur-xl bg-white/95 dark:bg-gray-950/95 border border-white/10 dark:border-gray-800/30 shadow-2xl rounded-2xl p-1 min-w-[220px]',
                    }}
                  >
                    <DropdownTrigger>
                      <motion.div
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="cursor-pointer rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center gap-2 px-3 py-2">
                          <div className="relative">
                            <Avatar
                              src={data?.user?.profilePicture}
                              fallback={data?.user?.username?.charAt(0).toUpperCase()}
                              size="sm"
                              className="ring-2 ring-blue-500/30 ring-offset-1 ring-offset-white/50 dark:ring-offset-gray-800/50"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white dark:border-gray-800 shadow-sm"></div>
                          </div>
                          <div className="hidden sm:block text-left min-w-0 flex-1">
                            <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                              {data?.user?.username}
                            </p>
                            <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                              {data?.user?.email}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </DropdownTrigger>

                    <DropdownMenu
                      aria-label="User menu"
                      variant="flat"
                      itemClasses={{
                        base: 'gap-3 p-2.5 rounded-xl data-[hover=true]:bg-white/60 dark:data-[hover=true]:bg-gray-800/60 data-[selectable=true]:focus:bg-white/60 dark:data-[selectable=true]:focus:bg-gray-800/60 transition-all duration-150 mb-0.5',
                        title: 'font-medium text-gray-800 dark:text-gray-200 text-sm',
                        description: 'text-gray-500 dark:text-gray-400 text-xs',
                      }}
                    >
                      <DropdownSection
                        showDivider
                        classNames={{
                          divider: 'bg-gray-200/50 dark:bg-gray-700/50 my-1',
                        }}
                      >
                        <DropdownItem
                          key="profile-header"
                          isReadOnly
                          className="cursor-default opacity-100 p-3 rounded-xl bg-gradient-to-br from-blue-50/60 to-purple-50/60 dark:from-blue-900/10 dark:to-purple-900/10 border border-blue-200/20 dark:border-blue-700/20"
                          textValue="Profile Info"
                        >
                          <div className="flex items-center gap-3 justify-between px-1">
                            <Avatar
                              src={data?.user?.profilePicture}
                              fallback={data?.user?.username?.charAt(0).toUpperCase()}
                              size="sm"
                              className="ring-2 ring-blue-500/20"
                            />
                            <div>
                              <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                                {data?.user?.username}
                              </p>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                              className="relative p-2 rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-md hover:shadow-lg transition-all duration-200 group"
                            >
                              <motion.div
                                initial={false}
                                animate={{
                                  rotate: theme === 'dark' ? 180 : 0,
                                }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="relative"
                              >
                                {theme === 'dark' ? (
                                  <RiMoonLine className="text-blue-400 text-base group-hover:text-blue-300 transition-colors duration-200" />
                                ) : (
                                  <RiSunLine className="text-amber-500 text-base group-hover:text-amber-400 transition-colors duration-200" />
                                )}
                              </motion.div>
                            </motion.button>
                          </div>
                        </DropdownItem>
                      </DropdownSection>

                      <DropdownItem
                        key="profile"
                        startContent={
                          <div className="p-1.5 rounded-lg bg-blue-100/60 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                            <RiUser3Line className="text-base" />
                          </div>
                        }
                        onClick={() => navigate('/home/user')}
                      >
                        <div>
                          <p className="text-sm">Profile</p>
                          <p className="text-xs opacity-60">Manage account</p>
                        </div>
                      </DropdownItem>

                      <DropdownItem
                        key="settings"
                        startContent={
                          <div className="p-1.5 rounded-lg bg-gray-100/60 dark:bg-gray-800/40 text-gray-600 dark:text-gray-400">
                            <RiSettings3Line className="text-base" />
                          </div>
                        }
                        onClick={() => navigate('/home/settings')}
                      >
                        <div>
                          <p className="text-sm">Settings</p>
                          <p className="text-xs opacity-60">Preferences</p>
                        </div>
                      </DropdownItem>

                      <DropdownSection
                        classNames={{
                          divider: 'bg-gray-200/50 dark:bg-gray-700/50 my-1',
                        }}
                      >
                        <DropdownItem
                          key="logout"
                          color="danger"
                          startContent={
                            <div className="p-1.5 rounded-lg bg-red-100/60 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                              <RiLogoutBoxLine className="text-base" />
                            </div>
                          }
                          onClick={handleLogout}
                          className="text-red-600 dark:text-red-400 data-[hover=true]:bg-red-50/60 dark:data-[hover=true]:bg-red-900/15"
                        >
                          <div>
                            <p className="text-sm">Sign Out</p>
                            <p className="text-xs opacity-60">End session</p>
                          </div>
                        </DropdownItem>
                      </DropdownSection>
                    </DropdownMenu>
                  </Dropdown>
                </motion.div>
              )}

              <NavbarItem className="md:hidden">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none transition-colors duration-200"
                >
                  {isMenuOpen ? <HiOutlineX size={18} /> : <RiMenu3Line size={18} />}
                </motion.button>
              </NavbarItem>
            </NavbarContent>
          </Navbar>
        </motion.div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={animations.menu}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed top-[4.5rem] left-2 right-2 z-50 md:hidden max-w-sm mx-auto"
            >
              <div className="backdrop-blur-xl bg-white/95 dark:bg-gray-950/95 border border-white/20 dark:border-gray-800/40 rounded-3xl shadow-2xl shadow-black/10 dark:shadow-black/30 p-6 overflow-hidden">
                <motion.nav className="flex flex-col gap-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item}
                      variants={animations.item}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.05 }}
                    >
                      {item === 'Editor' ? (
                        <motion.button
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full text-left p-3 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-200 font-semibold text-sm shadow-lg hover:shadow-xl flex items-center gap-2 relative overflow-hidden group"
                          onClick={() => {
                            navigate('/editor');
                            closeMenu();
                          }}
                        >
                          <RiCodeLine className="text-base group-hover:rotate-12 transition-transform duration-300" />
                          <span>Editor</span>
                          <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></span>
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.01, x: 4 }}
                          whileTap={{ scale: 0.99 }}
                          className="w-full text-left p-2.5 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 font-medium text-sm"
                          onClick={() => {
                            navigate(item === 'Home' ? '/' : `/${item.toLowerCase()}`);
                            closeMenu();
                          }}
                        >
                          {item}
                        </motion.button>
                      )}
                    </motion.div>
                  ))}

                  <motion.div
                    variants={animations.item}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.25 }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/20 dark:bg-gray-800/20 border border-white/10 dark:border-gray-700/10"
                  >
                    <span className="font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2 text-sm">
                      {theme === 'dark' ? (
                        <RiMoonLine className="text-blue-400 text-base" />
                      ) : (
                        <RiSunLine className="text-amber-500 text-base" />
                      )}
                      Theme
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleTheme}
                      className="p-1.5 rounded-lg bg-white/40 dark:bg-gray-700/40 backdrop-blur-sm border border-white/20 dark:border-gray-600/20 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <motion.div
                        initial={false}
                        animate={{
                          rotate: theme === 'dark' ? 180 : 0,
                        }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        {theme === 'dark' ? (
                          <RiMoonLine className="text-blue-400 text-sm" />
                        ) : (
                          <RiSunLine className="text-amber-500 text-sm" />
                        )}
                      </motion.div>
                    </motion.button>
                  </motion.div>

                  {isAuthenticated && (
                    <motion.div
                      variants={animations.item}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.3 }}
                      className="mt-4 pt-4 border-t border-white/20 dark:border-gray-700/30"
                    >
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-blue-50/60 to-purple-50/60 dark:from-blue-900/10 dark:to-purple-900/10 border border-blue-200/20 dark:border-blue-700/20 mb-3">
                        <Avatar
                          src={data?.user?.profilePicture}
                          fallback={data?.user?.username?.charAt(0).toUpperCase()}
                          size="sm"
                          className="ring-2 ring-blue-500/30"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 dark:text-gray-200 text-sm truncate">
                            {data?.user?.username}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {data?.user?.email}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {userMenuItems.map(item => (
                          <motion.button
                            key={item.key}
                            whileHover={{ scale: 1.01, x: 4 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full text-left p-2.5 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-200 font-medium text-sm flex items-center gap-3"
                            onClick={() => {
                              navigate(item.path);
                              closeMenu();
                            }}
                          >
                            <div
                              className={`p-1.5 rounded-lg bg-${item.color}-100/60 dark:bg-${item.color}-900/20 text-${item.color}-600 dark:text-${item.color}-400`}
                            >
                              <item.icon className="text-sm" />
                            </div>
                            {item.label}
                          </motion.button>
                        ))}

                        <motion.button
                          whileHover={{ scale: 1.01, x: 4 }}
                          whileTap={{ scale: 0.99 }}
                          className="w-full text-left p-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50/60 dark:hover:bg-red-900/15 transition-all duration-200 font-medium text-sm flex items-center gap-3"
                          onClick={() => {
                            handleLogout();
                            closeMenu();
                          }}
                        >
                          <div className="p-1.5 rounded-lg bg-red-100/60 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                            <RiLogoutBoxLine className="text-sm" />
                          </div>
                          Sign Out
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {!isAuthenticated && (
                    <motion.div
                      variants={animations.item}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.3 }}
                      className="mt-4 pt-4 border-t border-white/20 dark:border-gray-700/30"
                    >
                      <Button
                        variant="shadow"
                        fullWidth
                        size="md"
                        className="bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
                        onClick={() => {
                          handleSignUpClick();
                          closeMenu();
                        }}
                      >
                        Get Started
                      </Button>
                    </motion.div>
                  )}
                </motion.nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => dispatch(setIsModalOpen(false))}
            />
            <div className="relative z-10">
              <AuthenticateModal
                isOpen={isModalOpen}
                onClose={() => dispatch(setIsModalOpen(false))}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
