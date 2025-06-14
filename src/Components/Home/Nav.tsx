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
  RiQuestionLine,
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

  const navItems = ['Home', 'About', 'Questions', 'Blogs'];
  const userMenuItems = [
    {
      key: 'profile',
      icon: RiUser3Line,
      label: 'Profile',
      desc: 'Manage account',
      path: '/home/user',
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
    {
      key: 'help',
      icon: RiQuestionLine,
      label: 'Help',
      desc: 'Support center',
      path: '/home/help',
      color: 'emerald',
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
                    <Link
                      className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium relative group text-sm"
                      to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    >
                      {item}
                      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-200 rounded-full"></span>
                    </Link>
                  </motion.div>
                </NavbarItem>
              ))}
            </NavbarContent>

            <NavbarContent justify="end" className="gap-2">
              <NavbarItem className="hidden md:flex">
                <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    className="inline-flex items-center gap-2 editor-button px-4 py-2 rounded-xl dark:text-white text-gray-700 font-medium text-sm"
                    to="/editor"
                  >
                    <RiCodeLine className="text-base" />
                    <span>Editor</span>
                  </Link>
                </motion.div>
              </NavbarItem>

              <NavbarItem className="hidden lg:flex"></NavbarItem>

              <NavbarItem className="hidden lg:flex">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={isAuthenticated ? 'hidden' : ''}
                >
                  <Button
                    onClick={handleSignUpClick}
                    size="sm"
                    className="bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium px-4 py-2 rounded-xl shadow-md hover:shadow-purple-500/25 transition-all duration-200 border-0 text-sm"
                  >
                    Sign Up
                  </Button>
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

                      <DropdownItem
                        key="help"
                        startContent={
                          <div className="p-1.5 rounded-lg bg-emerald-100/60 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                            <RiQuestionLine className="text-base" />
                          </div>
                        }
                        onClick={() => navigate('/home/help')}
                      >
                        <div>
                          <p className="text-sm">Help</p>
                          <p className="text-xs opacity-60">Support center</p>
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
                    </motion.div>
                  ))}

                  <motion.div
                    variants={animations.item}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full text-left p-2.5 editor-button dark:text-white text-gray-700  font-medium text-sm flex items-center gap-2"
                      onClick={() => {
                        navigate('/editor');
                        setIsMenuOpen(false);
                      }}
                    >
                      <RiCodeLine className="text-base" />
                      Editor
                    </motion.button>
                  </motion.div>

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

                  {/* User Profile Section for Authenticated Users */}
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

                  {/* Sign Up Button for Non-Authenticated Users */}
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
