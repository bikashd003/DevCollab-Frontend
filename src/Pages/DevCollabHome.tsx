import React from 'react';
import { motion } from 'framer-motion';
import DP from "../assets/Developers collaborating.png"
import Footer from '../Components/Home/Footer';
import Commutity from '../Components/Home/Commutity';
import { setIsModalOpen } from '../Redux/OvarallSlice';

const DevCollabHome: React.FC = () => {

  const MotionLink = motion.a;

  return (
    <div className="font-sans min-h-screen transition-colors duration-300">
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
                onClick={() => setIsModalOpen(true)}>
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

export default DevCollabHome;