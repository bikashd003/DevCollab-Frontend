import React from 'react';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        <motion.h1 
          className="text-6xl font-bold text-purple-400 mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          404
        </motion.h1>
        <motion.div
          className="text-3xl font-semibold text-gray-300 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className="text-pink-400">&lt;</span>
          Page not found
          <span className="text-pink-400">/&gt;</span>
        </motion.div>
        <motion.p 
          className="text-xl text-gray-400 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          The code you're looking for seems to have vanished into the digital void.
        </motion.p>
        <motion.div
          className="inline-block"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <a 
            href="/" 
            className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-300 ease-in-out"
          >
            Return to Home
          </a>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <pre className="text-gray-600 text-sm">
          <code>
            {`
            function fixPage(error) {
              if (error === 404) {
                return 'Page not found';
              }
              return 'Unknown error';
            }
            
            console.log(fixPage(404));
            `}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default NotFound;
