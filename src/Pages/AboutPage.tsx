import { Accordion, AccordionItem } from '@nextui-org/react';
import { motion } from 'framer-motion';
import React from 'react';
import {
  FaCode,
  FaComments,
  FaGraduationCap,
  FaLightbulb,
  FaRocket,
  FaUsers,
} from 'react-icons/fa';
const CodeBackground = () => (
  <div className="absolute inset-0 overflow-hidden opacity-10 top-16">
    <pre className="text-[0.6rem] leading-tight">
      {`
  function collaborateCode(developers) {
    return developers.map(dev => {
      dev.skills.improve();
      dev.network.expand();
      dev.projects.succeed();
    });
  }
  
  const devCollab = {
    connect: () => "Building a global dev community",
    code: () => "Collaborative coding environment",
    learn: () => "Continuous learning and growth",
    innovate: () => "Pushing the boundaries of tech"
  };
  
  while (true) {
    devCollab.connect();
    devCollab.code();
    devCollab.learn();
    devCollab.innovate();
  }
        `}
    </pre>
  </div>
);
const SimulatedEditor = () => (
  <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 overflow-hidden md:w-[50%] w-[705] mx-auto">
    <div className="flex items-center mb-2">
      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
      <div className="w-3 h-3 rounded-full bg-green-500"></div>
    </div>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <p>
        <span className="text-blue-400">import</span> DevCollab{' '}
        <span className="text-blue-400">from</span>{' '}
        <span className="text-yellow-300">{`'dev-collaboration'`}</span>;
      </p>
      <p></p>
      <p>
        <span className="text-purple-400">const</span> myProject ={' '}
        <span className="text-blue-400">new</span> DevCollab.Project(
        <span className="text-yellow-300">{`'Awesome App'`}</span>);
      </p>
      <p></p>
      <p>myProject.collaborate(developers);</p>
      <p>myProject.brainstorm(ideas);</p>
      <p>myProject.review(code);</p>
      <p>myProject.techeachother(code);</p>
      <p>myProject.code(features);</p>
      <p></p>
      <p>
        <span className="text-green-300">{`// DevCollab: Where code comes to life!`}</span>
      </p>
    </motion.div>
  </div>
);
const AboutPage: React.FC = () => {
  const features = [
    {
      icon: <FaCode />,
      title: 'Collaborative Coding',
      description: 'Real-time code collaboration environment for seamless teamwork.',
    },
    {
      icon: <FaUsers />,
      title: 'Developer Networking',
      description: 'Connect with like-minded developers and expand your professional network.',
    },
    {
      icon: <FaComments />,
      title: 'Q&A Platform',
      description: 'Ask questions, share knowledge, and grow together as a community.',
    },
    {
      icon: <FaLightbulb />,
      title: 'Profile Showcase',
      description: 'Highlight your skills and projects with customizable developer profiles.',
    },
    {
      icon: <FaGraduationCap />,
      title: 'Learning Resources',
      description: 'Access tutorials, courses, and workshops to enhance your skills.',
    },
    {
      icon: <FaRocket />,
      title: 'Hackathons',
      description: 'Participate in exciting coding challenges and competitions.',
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-dark-background dark:text-dark-foreground py-12 px-4 sm:px-6 lg:px-8">
      <CodeBackground />
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center"
        >
          <motion.h1
            className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400"
            variants={itemVariants}
          >
            Welcome to DevCollab
          </motion.h1>
          <motion.p
            className="text-2xl mb-12 text-gray-600 dark:text-gray-300"
            variants={itemVariants}
          >
            Where Code Meets Collaboration
          </motion.p>
        </motion.div>
        <SimulatedEditor />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-16"
        >
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="pt-6"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flow-root bg-white dark:bg-gray-800  px-6 pb-8 rounded-lg shadow-lg">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                        {React.cloneElement(feature.icon as React.ReactElement, {
                          className: 'h-6 w-6 text-white',
                        })}
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium tracking-tight">{feature.title}</h3>
                    <p className="mt-5 text-base opacity-80">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-16"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-extrabold text-center mb-8">
            Upcoming Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4">AI Code Assistant</h3>
              <p className="opacity-80">
                Get intelligent code suggestions and generating code powered by advanced AI.
              </p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4">Code Execution</h3>
              <p className="opacity-80">Intregated code executions in various languages</p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4">Cross-Platform Mobile App</h3>
              <p className="opacity-80">
                Access DevCollab on-the-go with our upcoming mobile application.
              </p>
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-16 text-center"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-extrabold">
            Ready to revolutionize your coding experience?
          </motion.h2>
          <motion.p variants={itemVariants} className="mt-4 max-w-2xl mx-auto text-xl opacity-80">
            Join DevCollab today and become part of a community that&apos;s shaping the future of
            software development.
          </motion.p>
          <motion.div variants={itemVariants} className="mt-8">
            <p className="cursor-pointer inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Start Your Journey Now
            </p>
          </motion.div>
        </motion.div>
        <Accordion>
          {faqs.map((faq, index) => (
            <AccordionItem key={index} title={faq.question}>
              <p className="mb-4">{faq.answer}</p>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <hr />
    </div>
  );
};

export default AboutPage;
