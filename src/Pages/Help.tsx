import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HelpCircle,
  Search,
  Book,
  MessageSquare,
  Mail,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Input, Button, Accordion, AccordionItem } from '@nextui-org/react';

const Help: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqData = [
    {
      question: 'How do I create a new project?',
      answer:
        "Navigate to the Projects page and click the 'Create Project' button. Fill in the project details including title, description, and upload an image if desired.",
    },
    {
      question: 'How can I collaborate with other developers?',
      answer:
        'You can use the collaborative code editor by creating or joining a coding session. Share the session link with other developers to code together in real-time.',
    },
    {
      question: 'How do I update my profile information?',
      answer:
        "Go to your Profile page and click the 'Edit Profile' button. You can update your bio, skills, social links, and profile picture.",
    },
    {
      question: 'What programming languages are supported?',
      answer:
        'DevCollab supports 50+ programming languages including JavaScript, Python, Java, C++, Go, Rust, and many more.',
    },
    {
      question: 'How do I reset my password?',
      answer:
        "Click on 'Forgot Password' on the login page and follow the instructions sent to your email address.",
    },
    {
      question: 'Can I make my profile private?',
      answer:
        'Yes, you can control your profile visibility in the Settings page under Privacy & Security settings.',
    },
  ];

  const helpCategories = [
    {
      title: 'Getting Started',
      icon: <Book className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
      articles: [
        'Setting up your profile',
        'Creating your first project',
        'Understanding the interface',
        'Connecting with developers',
      ],
    },
    {
      title: 'Collaboration',
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500',
      articles: [
        'Real-time code editing',
        'Sharing projects',
        'Managing permissions',
        'Using chat features',
      ],
    },
    {
      title: 'Account & Settings',
      icon: <Mail className="w-5 h-5" />,
      color: 'from-emerald-500 to-teal-500',
      articles: [
        'Account security',
        'Privacy settings',
        'Notification preferences',
        'Deleting your account',
      ],
    },
  ];

  const filteredFAQ = faqData.filter(
    item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen ml-16 lg:ml-64 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Help Center</h1>
          <p className="text-slate-400 text-lg">Find answers to your questions and get support</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="max-w-2xl mx-auto">
            <Input
              placeholder="Search for help articles, FAQs, or topics..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              startContent={<Search className="w-5 h-5 text-slate-400" />}
              size="lg"
              classNames={{
                input: 'bg-slate-800/50 text-white placeholder:text-slate-400',
                inputWrapper:
                  'bg-slate-800/50 border-slate-700 hover:border-slate-600 focus-within:border-blue-500 shadow-lg',
              }}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Help Categories */}
          <div className="lg:col-span-2 space-y-8">
            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Browse by Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {helpCategories.map(category => (
                  <motion.div
                    key={category.title}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-10 h-10 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                      >
                        {category.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-white">{category.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {category.articles.map((article, articleIndex) => (
                        <li
                          key={articleIndex}
                          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200"
                        >
                          <ChevronRight className="w-4 h-4" />
                          <span className="text-sm">{article}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
              <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                <Accordion variant="splitted" className="px-0">
                  {filteredFAQ.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      aria-label={faq.question}
                      title={<span className="text-white font-medium">{faq.question}</span>}
                      className="text-slate-300"
                      classNames={{
                        base: 'bg-slate-800/30 border-slate-700/50',
                        title: 'text-white',
                        content: 'text-slate-300',
                      }}
                    >
                      <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </motion.div>
          </div>

          {/* Contact Support */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Need More Help?</h3>
              <p className="text-slate-400 mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                  startContent={<MessageSquare className="w-4 h-4" />}
                >
                  Start Live Chat
                </Button>
                <Button
                  variant="bordered"
                  className="w-full border-slate-600 text-slate-300"
                  startContent={<Mail className="w-4 h-4" />}
                >
                  Send Email
                </Button>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
              <div className="space-y-3">
                {[
                  { label: 'API Documentation', href: '#' },
                  { label: 'Community Forum', href: '#' },
                  { label: 'Feature Requests', href: '#' },
                  { label: 'Bug Reports', href: '#' },
                ].map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="flex items-center justify-between p-3 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 rounded-xl transition-all duration-200 group"
                  >
                    <span className="text-slate-300 group-hover:text-white">{link.label}</span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">API Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-emerald-400 text-sm">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Code Editor</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-emerald-400 text-sm">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">File Storage</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-emerald-400 text-sm">Operational</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
