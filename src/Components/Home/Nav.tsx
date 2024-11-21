import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Switch,
  User,
} from '@nextui-org/react';
import { useTheme } from '../../Context/ThemeProvider';
import { BsSun } from 'react-icons/bs';
import { IoMoonSharp } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import { IoMenu } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setIsModalOpen } from '../../Redux/OvarallSlice';
import type { RootState } from '../../Redux/Store';
import AuthenticateModal from '../Modal/AuthenticateModal';
import { useAuth } from '../../Secure/AuthContext';
import { useQuery } from '@apollo/client';
import { GET_USER_DATA } from '../../GraphQL/Queries/Profile/Users';

const Nav = () => {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const { data } = useQuery(GET_USER_DATA);
  const isModalOpen = useSelector((state: RootState) => state.overall.isModalOpen);
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const MotionLink = motion.a;
  const menuVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: '-100%' },
  };
  const modalVariants = {
    open: { opacity: 1, y: 500 },
    closed: { opacity: 0, y: 0 },
  };
  const handleSignUpClick = () => {
    if (!isAuthenticated) {
      dispatch(setIsModalOpen(true));
    }
  };
  return (
    <>
      <Navbar isBordered isBlurred className="font-sans">
        <NavbarBrand>
          <p className="font-bold text-inherit cursor-pointer" onClick={() => navigate('/')}>
            DevCollab
          </p>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link className="text-foreground hover:text-gray-400" to="/">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link to="/about" className="text-foreground hover:text-gray-400">
              About
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className="text-foreground hover:text-gray-400" to="/questions">
              Questions
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className="text-foreground hover:text-gray-400" to="/blogs">
              Blogs
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              className="px-4 py-1 font-medium text-white bg-gradient-to-r from-blue-500 to-gray-600 rounded-lg hover:from-blue-600 hover:to-gray-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              to="/editor"
            >
              Editor
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Switch
              defaultSelected
              size="sm"
              color="success"
              startContent={<BsSun />}
              endContent={<IoMoonSharp />}
              onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            />
          </NavbarItem>
          <NavbarItem className="hidden lg:flex">
            <MotionLink
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700 transition duration-300 ${isAuthenticated ? 'hidden' : ''}`}
              onClick={() => handleSignUpClick()}
            >
              Sign Up
            </MotionLink>
          </NavbarItem>
          {isAuthenticated && (
            <User
              name={data?.user?.username}
              description={<Link to="/home/user">{data?.user?.username}</Link>}
              avatarProps={{
                src: `${data?.user?.profilePicture}`,
              }}
            />
          )}
          <NavbarItem className="sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
            >
              {isMenuOpen ? <MdOutlineClose /> : <IoMenu />}
            </button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            transition={{ duration: 0.5 }}
            className="fixed top-16 left-0 right-0 bg-background z-50 p-4 shadow-lg sm:hidden"
          >
            <motion.nav className="flex flex-col gap-4">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="text-foreground pl-2"
                onClick={() => navigate('/')}
              >
                Home
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="text-foreground"
                onClick={() => navigate('/about')}
              >
                About
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="text-foreground"
                onClick={() => navigate('/questions')}
              >
                Questions
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="text-foreground"
                onClick={() => navigate('/blogs')}
              >
                Blogs
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className={`text-foreground ${isAuthenticated ? 'hidden' : ''}`}
              >
                <Button
                  color="primary"
                  variant="flat"
                  fullWidth
                  onClick={() => handleSignUpClick()}
                >
                  Sign Up
                </Button>
              </motion.a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        variants={modalVariants}
        initial="closed"
        animate={isModalOpen ? 'open' : 'closed'}
        transition={{ duration: 0.3 }}
      >
        <AuthenticateModal isOpen={isModalOpen} onClose={() => dispatch(setIsModalOpen(false))} />
      </motion.div>
    </>
  );
};
export default Nav;
