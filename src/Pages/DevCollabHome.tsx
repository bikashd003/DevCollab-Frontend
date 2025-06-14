import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import {
  Code2,
  Users,
  Zap,
  Target,
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  Rocket,
} from 'lucide-react';
import DP from '../assets/Developers collaborating.png';
import { setIsModalOpen } from '../Redux/OvarallSlice';
import { useAuth } from '../Secure/AuthContext';
import CookieConsent from '../Components/CookieConsent/CookieConsent';

const DevCollabHome: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      dispatch(setIsModalOpen(true));
    }
  };

  const features = [
    {
      icon: <Code2 className="w-8 h-8" />,
      title: 'Collaborative Coding',
      description:
        'Work together in real-time with developers worldwide on challenging projects and coding exercises.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Peer Learning',
      description: 'Learn from experienced developers and share your knowledge with the community.',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Feedback',
      description: 'Get immediate feedback on your code and improve your skills faster than ever.',
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Skill Tracking',
      description: 'Track your progress and see how your coding skills improve over time.',
    },
  ];

  const prelaunchStats = [
    { number: '2K+', label: 'Beta Testers' },
    { number: '500+', label: 'Projects Created' },
    { number: '100%', label: 'Uptime Goal' },
    { number: 'Q3 2025', label: 'Launch Target' },
  ];

  return (
    <div className="font-sans min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      <main>
        {/* Modern Hero Section */}
        <section className="relative overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:w-1/2 text-center lg:text-left"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full text-sm font-medium mb-6"
                >
                  <Rocket className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="text-blue-700 dark:text-blue-300">
                    Coming Soon - Join Our Beta
                  </span>
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900 dark:text-white">
                  Level Up Your{' '}
                  <span className="text-blue-600 dark:text-blue-400">Coding Skills</span> Together
                </h1>

                <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300 leading-relaxed">
                  Join the world's most collaborative coding community. Learn, build, and grow with
                  developers from around the globe.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGetStarted}
                    className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition duration-300 flex items-center justify-center shadow-lg hover:shadow-xl ${isAuthenticated ? 'hidden' : ''}`}
                  >
                    Join Beta Waitlist
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-transparent border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-300 flex items-center justify-center"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Watch Demo
                  </motion.button>
                </div>

                {/* Pre-launch Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
                >
                  {prelaunchStats.map((stat, index) => (
                    <div key={index} className="text-center lg:text-left">
                      <div className="text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {stat.number}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:w-1/2"
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-blue-100 dark:bg-blue-900/20 rounded-3xl blur-xl opacity-60"></div>
                  <img
                    src={DP}
                    alt="Developers collaborating"
                    className="relative rounded-2xl shadow-2xl w-full transform hover:scale-105 transition duration-500 border border-gray-200 dark:border-gray-700"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose DevCollab?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Experience the future of collaborative coding with our cutting-edge platform
                designed for modern developers.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 h-full hover:-translate-y-1">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors duration-300">
                      <div className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-700 dark:text-blue-300">Early Access Available</span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                Ready to Transform Your Coding Journey?
              </h2>
              <p className="text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Be among the first to experience the future of collaborative coding. Join our beta
                program and help shape the platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGetStarted}
                  className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition duration-300 flex items-center shadow-lg hover:shadow-xl ${isAuthenticated ? 'hidden' : ''}`}
                >
                  Get Early Access
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>

                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  <span>Free beta access • No credit card required</span>
                </div>
              </div>

              <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong className="text-gray-900 dark:text-white">Beta Status:</strong> Currently
                  in closed beta with select developers
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Join our waitlist to be notified when we open registration to the public
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <CookieConsent />
    </div>
  );
};

export default DevCollabHome;
