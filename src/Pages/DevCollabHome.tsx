import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { Zap, ArrowRight, CheckCircle, Rocket, Terminal } from 'lucide-react';
import { setIsModalOpen } from '../Redux/OvarallSlice';
import { useAuth } from '../Secure/AuthContext';
import CodeEditorMockup from '../Components/Home/CodeEditorMockup';

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
      icon: <Terminal className="w-8 h-8" />,
      title: 'Live Code Editor',
      description:
        'Real-time collaborative coding with syntax highlighting, autocomplete, and multi-language support.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Execution',
      description:
        'Run code instantly in cloud containers with support for 50+ programming languages.',
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  const techStack = [
    { name: 'JavaScript', icon: '{}' },
    { name: 'Python', icon: 'py' },
    { name: 'React', icon: '⚛️' },
    { name: 'Node.js', icon: '🟢' },
    { name: 'Go', icon: 'go' },
    { name: 'Rust', icon: '🦀' },
  ];

  const floatingElements = Array.from({ length: 20 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute text-slate-400/20 dark:text-slate-600/20 pointer-events-none"
      initial={{
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
      }}
      animate={{
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
        rotate: 360,
      }}
      transition={{
        duration: Math.random() * 20 + 10,
        repeat: Infinity,
        repeatType: 'reverse',
      }}
    >
      {['{', '}', '()', '[]', '<>', '/>', '&&', '||', '=>', '++'][Math.floor(Math.random() * 10)]}
    </motion.div>
  ));

  return (
    <div className="font-mono min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="fixed inset-0 overflow-hidden">{floatingElements}</div>

      <div
        className="fixed inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      <main className="relative z-10">
        <section className="relative min-h-screen flex items-center">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse delay-2000" />

          <div className="container mx-auto px-6 lg:px-8 py-20">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="lg:w-1/2 text-center lg:text-left"
              >
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                >
                  <span className="text-white">Code</span>{' '}
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    Together
                  </span>
                  <br />
                  <span className="text-white">Build</span>{' '}
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    Faster
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-xl md:text-2xl mb-8 text-slate-300 leading-relaxed max-w-2xl"
                >
                  The ultimate collaborative coding platform where developers unite to create,
                  learn, and innovate together in real-time.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-12"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGetStarted}
                    className={`group relative bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-purple-500/25 hover:shadow-2xl ${isAuthenticated ? 'hidden' : ''}`}
                  >
                    <span className="relative z-10">Start Coding Together</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex flex-wrap gap-4 justify-center lg:justify-start"
                >
                  {techStack.map((tech, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-slate-800/50 backdrop-blur-sm border border-slate-700 px-4 py-2 rounded-lg text-sm"
                    >
                      <span className="mr-2">{tech.icon}</span>
                      <span className="text-slate-300">{tech.name}</span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              <CodeEditorMockup />
            </div>
          </div>
        </section>

        <section className="py-32 relative">
          <div className="container mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Powerful Features for Modern Developers
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Everything you need to collaborate, code, and create together in one powerful
                platform
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <div className="relative p-8 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl hover:border-slate-600 transition-all duration-500 h-full">
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500`}
                    />

                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <div className="text-white">{feature.icon}</div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-lg">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 relative">
          <div className="container mx-auto px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-full text-sm font-semibold mb-8"
              >
                <Rocket className="w-4 h-4 mr-2 text-emerald-400" />
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Ready to Launch
                </span>
              </motion.div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
                  Ready to revolutionize your coding experience?
                </span>
              </h2>

              <p className="text-xl mb-12 text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Join many developers who are already building the future together. Start your
                collaborative coding journey today.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex flex-wrap justify-center gap-8 mt-16 text-slate-400"
              >
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  <span>Free forever plan</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  <span>Instant setup</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DevCollabHome;
