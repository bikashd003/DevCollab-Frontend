import React, { useState } from 'react';
import { useTheme } from '../Context/ThemeProvider';
import { motion } from 'framer-motion';
import { MdOutlineMenu } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';
import DP from "../assets/Developers collaborating.png"
import AuthenticateModal from '../Components/Modal/AuthenticateModal';
import Footer from '../Components/Footer';
import Commutity from '../Components/Commutity';

const DevLearnPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const MotionLink = motion.a;
  const modalVariants = {
    open: { opacity: 1, y: 500 },
    closed: { opacity: 0, y: 0 },
  };
  return (
    <div className="font-sans bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen transition-colors duration-300">
      <motion.div
        variants={modalVariants}
        initial="closed"
        animate={isModalOpen ? 'open' : 'closed'}
        transition={{ duration: 0.3 }}
      >
        <AuthenticateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </motion.div>
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">DevLearn</div>
            </motion.div>
            <div className="hidden md:flex items-center space-x-4">
              <MotionLink href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300"
              >
                Features
              </MotionLink>
              <MotionLink href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300"
              >
                Community
              </MotionLink>
              <MotionLink href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300"
              >
                Pricing
              </MotionLink>
              <MotionLink href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700 transition duration-300"
                onClick={() => setIsModalOpen(true)}
              >
                Sign Up
              </MotionLink>
              <motion.button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`w-11 h-5 flex items-center rounded-full ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
                  } transition-colors duration-300 focus:outline-none`}
                whileTap={{ scale: 0.7 }}
              >
                <motion.div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  transition={{ type: "spring", stiffness: 700, damping: 30 }}
                />
              </motion.button>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
              >
                {isMenuOpen ? (
                  <IoCloseSharp size={22} />
                ) : (
                  <MdOutlineMenu size={22} />
                )}
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 space-y-2 fixed top-10 right-0 z-50 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg h-full w-[15rem]"
            >
              <Link to="#" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">Features</Link>
              <Link to="#" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">Community</Link>
              <Link to="#" className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">Pricing</Link>
              <Link to="#" className="block text-white px-4  hover:bg-blue-700 transition duration-300 text-center">Sign Up</Link>
            </motion.div>
          )}
        </nav>
      </header>

      <main>
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2 mb-10 md:mb-0"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Level Up Your Coding Skills Together</h1>
              <p className="text-xl mb-6">Collaborative learning for developers, by developers</p>
              <MotionLink href="#"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition duration-300 inline-block"
              >
                Get Started
              </MotionLink>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2"
            >
              <img src={DP} alt="Developers collaborating" className="rounded-lg shadow-lg w-full" />
            </motion.div>
          </div>

        </section>
      <Commutity />
      </main>

     
      <Footer />
    </div>
  );
};

export default DevLearnPage;