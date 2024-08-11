import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DP from "../assets/Developers collaborating.png"
import AuthenticateModal from '../Components/Modal/AuthenticateModal';
import Footer from '../Components/Home/Footer';
import Commutity from '../Components/Home/Commutity';
import Nav from '../Components/Home/Nav';

const DevLearnPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <Nav setIsModalOpen={setIsModalOpen}/>
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