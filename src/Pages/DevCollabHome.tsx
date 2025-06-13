import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { Code2, Users, Zap, Target, ArrowRight, Play, CheckCircle, Star } from 'lucide-react';
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

  const stats = [
    { number: '50K+', label: 'Active Developers' },
    { number: '100K+', label: 'Projects Completed' },
    { number: '95%', label: 'Success Rate' },
    { number: '24/7', label: 'Community Support' },
  ];

  return (
    <div className="font-sans min-h-screen transition-colors duration-300 bg-background dark:bg-dark-background">
      <main>
        {/* Enhanced Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900 text-white">
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
                  className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6"
                >
                  <Star className="w-4 h-4 mr-2 text-yellow-400" />
                  Trusted by 50,000+ developers worldwide
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Level Up Your{' '}
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    Coding Skills
                  </span>{' '}
                  Together
                </h1>

                <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
                  Join the world's most collaborative coding community. Learn, build, and grow with
                  developers from around the globe.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGetStarted}
                    className={`bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition duration-300 flex items-center justify-center shadow-lg ${isAuthenticated ? 'hidden' : ''}`}
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition duration-300 flex items-center justify-center"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Watch Demo
                  </motion.button>
                </div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/20"
                >
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center lg:text-left">
                      <div className="text-2xl lg:text-3xl font-bold text-yellow-400">
                        {stat.number}
                      </div>
                      <div className="text-blue-100 text-sm">{stat.label}</div>
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
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-2xl opacity-30 transform rotate-6"></div>
                  <img
                    src={DP}
                    alt="Developers collaborating"
                    className="relative rounded-2xl shadow-2xl w-full transform hover:scale-105 transition duration-500"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-32 bg-background dark:bg-dark-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground dark:text-dark-foreground mb-4">
                Why Choose DevCollab?
              </h2>
              <p className="text-xl text-muted-foreground dark:text-gray-400 max-w-3xl mx-auto">
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
                  <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 h-full">
                    <div className="text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground dark:text-dark-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white relative overflow-hidden">
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Ready to Transform Your Coding Journey?
              </h2>
              <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Join thousands of developers who are already collaborating, learning, and building
                amazing projects together.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGetStarted}
                  className={`bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition duration-300 flex items-center shadow-lg ${isAuthenticated ? 'hidden' : ''}`}
                >
                  Start Collaborating Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>

                <div className="flex items-center text-blue-100">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  <span>Free to get started • No credit card required</span>
                </div>
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
