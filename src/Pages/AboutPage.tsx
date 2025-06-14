import { Accordion, AccordionItem } from '@nextui-org/react';
import { motion } from 'framer-motion';
import React from 'react';
import {
  Code2,
  Users,
  MessageCircle,
  Lightbulb,
  Rocket,
  GraduationCap,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Target,
  Globe,
} from 'lucide-react';
const HeroBackground = () => (
  <div className="absolute inset-0 overflow-hidden opacity-5">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
  </div>
);
const CodeShowcase = () => (
  <div className="relative max-w-4xl mx-auto">
    <div className="absolute -inset-4 bg-blue-100 dark:bg-blue-900/20 rounded-3xl blur-xl opacity-60"></div>
    <div className="relative bg-gray-900 dark:bg-gray-800 rounded-2xl p-6 font-mono text-sm overflow-hidden border border-gray-200 dark:border-gray-700 shadow-2xl">
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
        <span className="ml-4 text-gray-400 text-xs">DevCollab.js</span>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, staggerChildren: 0.1 }}
        className="space-y-1"
      >
        <motion.p className="text-green-400">
          <span className="text-blue-400">import</span> DevCollab{' '}
          <span className="text-blue-400">from</span>{' '}
          <span className="text-yellow-300">'@devcollab/core'</span>;
        </motion.p>
        <motion.p></motion.p>
        <motion.p className="text-green-400">
          <span className="text-purple-400">const</span>{' '}
          <span className="text-blue-300">community</span> ={' '}
          <span className="text-blue-400">new</span> DevCollab.Community();
        </motion.p>
        <motion.p></motion.p>
        <motion.p className="text-green-400">
          community.connect(<span className="text-yellow-300">'global-developers'</span>);
        </motion.p>
        <motion.p className="text-green-400">
          community.collaborate(<span className="text-yellow-300">'real-time'</span>);
        </motion.p>
        <motion.p className="text-green-400">
          community.learn(<span className="text-yellow-300">'together'</span>);
        </motion.p>
        <motion.p className="text-green-400">
          community.build(<span className="text-yellow-300">'amazing-projects'</span>);
        </motion.p>
        <motion.p></motion.p>
        <motion.p className="text-gray-500">
          <span className="text-green-300">{'// '}Join the future of collaborative coding</span>
        </motion.p>
      </motion.div>
    </div>
  </div>
);
const AboutPage: React.FC = () => {
  const features = [
    {
      icon: <Code2 className="w-8 h-8" />,
      title: 'Collaborative Coding',
      description:
        'Work together in real-time with developers worldwide on challenging projects and coding exercises.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Developer Networking',
      description:
        'Connect with like-minded developers and expand your professional network globally.',
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Q&A Platform',
      description: 'Ask questions, share knowledge, and grow together as a vibrant community.',
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Profile Showcase',
      description: 'Highlight your skills and projects with customizable developer profiles.',
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: 'Learning Resources',
      description: 'Access tutorials, courses, and workshops to enhance your coding skills.',
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Hackathons & Challenges',
      description: 'Participate in exciting coding challenges and competitive programming events.',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Active Developers' },
    { number: '50K+', label: 'Code Collaborations' },
    { number: '1M+', label: 'Lines of Code' },
    { number: '100+', label: 'Countries' },
  ];
  const upcomingFeatures = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'AI Code Assistant',
      description:
        'Get intelligent code suggestions and automated code generation powered by advanced AI.',
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Code Execution',
      description:
        'Integrated code execution environment supporting multiple programming languages.',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Mobile App',
      description:
        'Access DevCollab on-the-go with our upcoming cross-platform mobile application.',
    },
  ];

  const faqs = [
    {
      question: 'Is DevCollab free to use?',
      answer:
        'We offer a free tier with essential features. Premium plans are available for advanced collaboration tools and increased storage.',
    },
    {
      question: 'Can I use DevCollab for private projects?',
      answer:
        'DevCollab supports both public and private repositories, ensuring your proprietary code remains secure.',
    },
    {
      question: 'How does the Q&A reputation system work?',
      answer:
        'Users earn points by providing helpful answers, sharing quality code, and contributing to discussions. Higher reputation unlocks special features and opportunities.',
    },
    {
      question: 'Does DevCollab offer job placement services?',
      answer:
        "While we don't directly place developers, our job board connects talented developers with top companies looking to hire.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-white dark:bg-gray-900 overflow-hidden">
        <HeroBackground />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full text-sm font-medium mb-6"
            >
              <Star className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-300">About DevCollab</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900 dark:text-white"
            >
              Where Code Meets{' '}
              <span className="text-blue-600 dark:text-blue-400">Collaboration</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl mb-12 text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto"
            >
              Empowering developers worldwide to learn, collaborate, and build amazing projects
              together. Join our community and transform your coding journey.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Code Showcase Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <CodeShowcase />
          </motion.div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Developers Worldwide
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join thousands of developers who are already transforming their coding experience
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
              </motion.div>
            ))}
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
              Experience the future of collaborative coding with our cutting-edge platform designed
              for modern developers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    <div className="text-blue-600 dark:text-blue-400">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
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

      {/* Upcoming Features Section */}
      <section className="py-20 lg:py-32 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full text-sm font-medium mb-6">
              <Rocket className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-700 dark:text-blue-300">Coming Soon</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Upcoming Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're constantly innovating to bring you the best collaborative coding experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 h-full hover:-translate-y-1">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors duration-300">
                    <div className="text-blue-600 dark:text-blue-400">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
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
      <section className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-900">
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
              <span className="text-blue-700 dark:text-blue-300">Join the Community</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Ready to Transform Your Coding Journey?
            </h2>
            <p className="text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Be among the first to experience the future of collaborative coding. Join our
              community and help shape the platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition duration-300 flex items-center shadow-lg hover:shadow-xl"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>

              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                <span>Free to join • No credit card required</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-20 lg:py-32 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Got questions? We've got answers. Here are some common questions about DevCollab.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Accordion variant="splitted" className="gap-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  title={faq.question}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                  classNames={{
                    title: 'text-gray-900 dark:text-white font-semibold',
                    content: 'text-gray-600 dark:text-gray-300 leading-relaxed',
                  }}
                >
                  <p className="pb-4">{faq.answer}</p>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
