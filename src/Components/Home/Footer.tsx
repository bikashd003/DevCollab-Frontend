import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Terminal, Zap } from 'lucide-react';

const Footer: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Blog', href: '/blogs' },
  ];

  const floatingElements = Array.from({ length: 8 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute text-slate-600/10 pointer-events-none text-2xl"
      initial={{
        x: Math.random() * 100,
        y: Math.random() * 100,
      }}
      animate={{
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotate: 360,
      }}
      transition={{
        duration: Math.random() * 15 + 10,
        repeat: Infinity,
        repeatType: 'reverse',
      }}
    >
      {['{', '}', '()', '[]', '<>', '/>', '&&', '||'][Math.floor(Math.random() * 8)]}
    </motion.div>
  ));

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700/50 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">{floatingElements}</div>

      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        <div className="py-6 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  DevCollab
                </h3>
              </div>

              <p className="text-slate-300 mb-8 max-w-2xl leading-relaxed text-lg">
                Building the future of collaborative coding. Connect, learn, and grow with
                developers from around the world in our innovative platform.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="inline-flex items-center px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-full text-sm">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-emerald-400 font-medium">Currently in Beta</span>
                </div>

                <div className="inline-flex items-center px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-full text-sm">
                  <Terminal className="w-4 h-4 mr-2 text-purple-400" />
                  <span className="text-slate-300">50+ Languages</span>
                </div>

                <div className="inline-flex items-center px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-full text-sm">
                  <Zap className="w-4 h-4 mr-2 text-orange-400" />
                  <span className="text-slate-300">Real-time Collaboration</span>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h4 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Quick Links
              </h4>
              <ul className="space-y-4">
                {quickLinks.map(link => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="group flex items-center text-slate-400 hover:text-white transition-all duration-300 text-base"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 mr-0 group-hover:mr-3 transition-all duration-300 rounded-full"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        <motion.div variants={itemVariants} className="py-8 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-slate-400 text-sm">
              <span>&copy; {new Date().getFullYear()} DevCollab. All rights reserved.</span>
            </div>

            <div className="flex items-center text-slate-400 text-sm">
              <span className="flex items-center">
                Made with <Heart className="w-4 h-4 text-red-400 mx-2 animate-pulse" /> for
                developers worldwide
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
