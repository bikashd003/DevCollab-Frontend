import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.footer 
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300 py-8"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <motion.div 
            variants={itemVariants}
            className="w-full md:w-1/3 mb-6 md:mb-0"
          >
            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">DevCollab</h3>
            <p className="text-gray-600 dark:text-gray-400">Connecting developers worldwide</p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="w-full md:w-1/3 mb-6 md:mb-0"
          >
            <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link to="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Projects</Link></li>
              <li><Link to="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Developers</Link></li>
              <li><Link to="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link></li>
            </ul>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="w-full md:w-1/3"
          >
            <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Connect With Us</h4>
            <div className="flex space-x-4">
              <motion.a 
                whileHover={{ y: -3 }}
                href="#" 
                className="text-2xl text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <FaGithub />
              </motion.a>
              <motion.a 
                whileHover={{ y: -3 }}
                href="#" 
                className="text-2xl text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <FaLinkedin />
              </motion.a>
              <motion.a 
                whileHover={{ y: -3 }}
                href="#" 
                className="text-2xl text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <FaTwitter />
              </motion.a>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          variants={itemVariants}
          className="mt-8 pt-8 border-t border-gray-300 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400"
        >
          <p>&copy; {new Date().getFullYear()} DevCollab. All rights reserved.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;