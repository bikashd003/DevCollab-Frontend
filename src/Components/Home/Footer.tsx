import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Mail, Heart, Rocket } from 'lucide-react';

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
        duration: 0.6,
        staggerChildren: 0.1,
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
      className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">DevCollab</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md leading-relaxed">
                Building the future of collaborative coding. Connect, learn, and grow with
                developers from around the world in our innovative platform.
              </p>

              {/* Beta Status Badge */}
              <div className="inline-flex items-center px-3 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  Currently in Beta
                </span>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h4 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Platform</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Home', href: '#' },
                  { name: 'Features', href: '#' },
                  { name: 'Beta Access', href: '#' },
                  { name: 'Documentation', href: '#' },
                  { name: 'Roadmap', href: '#' },
                ].map(link => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company Links */}
            <motion.div variants={itemVariants}>
              <h4 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Company</h4>
              <ul className="space-y-3">
                {[
                  { name: 'About Us', href: '#' },
                  { name: 'Blog', href: '#' },
                  { name: 'Careers', href: '#' },
                  { name: 'Contact', href: '#' },
                  { name: 'Privacy Policy', href: '#' },
                ].map(link => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          variants={itemVariants}
          className="py-6 border-t border-gray-200 dark:border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
              <span>&copy; {new Date().getFullYear()} DevCollab. All rights reserved.</span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> for developers
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-3">Follow us:</span>
              <motion.a
                whileHover={{ y: -2, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl flex items-center justify-center transition-colors duration-200 group"
              >
                <FaGithub className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </motion.a>
              <motion.a
                whileHover={{ y: -2, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl flex items-center justify-center transition-colors duration-200 group"
              >
                <FaLinkedin className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </motion.a>
              <motion.a
                whileHover={{ y: -2, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl flex items-center justify-center transition-colors duration-200 group"
              >
                <FaTwitter className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </motion.a>
              <motion.a
                whileHover={{ y: -2, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:hello@devcollab.com"
                className="w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl flex items-center justify-center transition-colors duration-200 group"
              >
                <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          variants={itemVariants}
          className="py-8 border-t border-gray-200 dark:border-gray-800"
        >
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Stay Updated
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Get notified about our launch and exclusive beta updates.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-w-0 flex-1 lg:w-64"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200 whitespace-nowrap"
                >
                  Join Waitlist
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
