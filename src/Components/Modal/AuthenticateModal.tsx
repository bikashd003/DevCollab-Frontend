import axios from 'axios';
import type { FormikHelpers } from 'formik';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { Eye, EyeOff, X, Zap, ArrowRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { motion, AnimatePresence } from 'framer-motion';

import BackendApi from '../../Constant/Api';
import LoginSchema from '../../Schemas/LoginSchema';
import SignupSchema from '../../Schemas/SignupSchema';
import { Checkbox } from '@nextui-org/react';
import { toast } from 'sonner';
import { useAuth } from '../../Secure/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}
type FormValues =
  | { type: 'login'; email: string; password: string; rememberMeChecked: boolean }
  | {
      type: 'signup';
      username: string;
      email: string;
      password: string;
      confirmPassword: string;
      rememberMeChecked: boolean;
    };

const AuthenticateModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const { setIsAuthenticated } = useAuth();
  const [rememberMeChecked, setRememberMeChecked] = useState(false);

  const handleSubmit = async (value: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    if (rememberMeChecked) {
      value.rememberMeChecked = rememberMeChecked;
    }
    try {
      const response = await axios.post(
        `${BackendApi}/auth/${isLogin ? 'login' : 'signup'}`,
        value,
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        toast.success(response.data.message);
        setIsLogin(true);
      } else if (response.status === 200) {
        toast.success(response.data.message);
        localStorage.setItem('user', JSON.stringify({ isAuthenticate: true }));
        setIsAuthenticated(true);
        onClose();
        // Redirect will be handled by AuthRedirectHandler
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };
  const initialValues: FormValues = isLogin
    ? { type: 'login', email: '', password: '', rememberMeChecked: false }
    : {
        type: 'signup',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        rememberMeChecked: false,
      };

  const handleGithubAuth = async () => {
    try {
      const response = await axios.get(`${BackendApi}/auth/github/url`);
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      toast.error('Failed to initiate GitHub authentication');
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const response = await axios.get(`${BackendApi}/auth/google/url`);
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      toast.error('Failed to initiate Google authentication');
    }
  };
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-md mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />

              <div className="absolute top-4 left-4 w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl" />
              <div className="absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl" />

              <div className="relative p-8">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-slate-800/50"
                >
                  <X className="w-5 h-5" />
                </motion.button>

                <div className="text-center mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full text-sm font-semibold mb-4"
                  >
                    <Zap className="w-4 h-4 mr-2 text-purple-400" />
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {isLogin ? 'Welcome Back' : 'Join DevCollab'}
                    </span>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold text-white mb-2"
                  >
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-slate-400"
                  >
                    {isLogin
                      ? 'Continue your coding journey'
                      : 'Start collaborating with developers worldwide'}
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-2 gap-3 mb-6"
                >
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGithubAuth}
                    className="flex items-center justify-center px-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl text-white hover:border-slate-600 transition-all duration-200 group"
                  >
                    <FaGithub className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">GitHub</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoogleAuth}
                    className="flex items-center justify-center px-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl text-white hover:border-slate-600 transition-all duration-200 group"
                  >
                    <FcGoogle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium">Google</span>
                  </motion.button>
                </motion.div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-slate-900 text-slate-400">or continue with email</span>
                  </div>
                </div>

                <Formik
                  initialValues={initialValues}
                  validationSchema={isLogin ? LoginSchema : SignupSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched, isSubmitting }) => (
                    <Form className="space-y-4">
                      {!isLogin && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <label
                            htmlFor="username"
                            className="block text-sm font-medium text-slate-300 mb-2"
                          >
                            Username
                          </label>
                          <Field
                            type="text"
                            id="username"
                            name="username"
                            className={`w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 ${
                              !isLogin &&
                              'username' in errors &&
                              'username' in touched &&
                              errors.username &&
                              touched.username
                                ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500'
                                : 'border-slate-700 hover:border-slate-600'
                            }`}
                            placeholder="Enter your username"
                          />
                          <ErrorMessage
                            name="username"
                            component="div"
                            className="mt-2 text-sm text-red-400"
                          />
                        </motion.div>
                      )}

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-slate-300 mb-2"
                        >
                          Email
                        </label>
                        <Field
                          type="email"
                          id="email"
                          name="email"
                          className={`w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 ${
                            errors.email && touched.email
                              ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500'
                              : 'border-slate-700 hover:border-slate-600'
                          }`}
                          placeholder="Enter your email"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="mt-2 text-sm text-red-400"
                        />
                      </div>

                      <div className="relative">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-slate-300 mb-2"
                        >
                          Password
                        </label>
                        <Field
                          type={isVisible ? 'text' : 'password'}
                          id="password"
                          name="password"
                          className={`w-full px-4 py-3 pr-12 bg-slate-800/50 backdrop-blur-sm border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 ${
                            errors.password && touched.password
                              ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500'
                              : 'border-slate-700 hover:border-slate-600'
                          }`}
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setIsVisible(!isVisible)}
                          className="absolute right-3 top-[2.5rem] p-1 text-slate-400 hover:text-white transition-colors duration-200"
                        >
                          {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="mt-2 text-sm text-red-400"
                        />
                      </div>

                      {!isLogin && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="relative"
                        >
                          <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-slate-300 mb-2"
                          >
                            Confirm Password
                          </label>
                          <Field
                            type={isVisible ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            className={`w-full px-4 py-3 pr-12 bg-slate-800/50 backdrop-blur-sm border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 ${
                              !isLogin &&
                              'confirmPassword' in errors &&
                              'confirmPassword' in touched &&
                              errors.confirmPassword &&
                              touched.confirmPassword
                                ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500'
                                : 'border-slate-700 hover:border-slate-600'
                            }`}
                            placeholder="Confirm your password"
                          />
                          <button
                            type="button"
                            onClick={() => setIsVisible(!isVisible)}
                            className="absolute right-3 top-[2.5rem] p-1 text-slate-400 hover:text-white transition-colors duration-200"
                          >
                            {isVisible ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                          <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className="mt-2 text-sm text-red-400"
                          />
                        </motion.div>
                      )}

                      {isLogin && (
                        <div className="flex items-center justify-between">
                          <Checkbox
                            size="sm"
                            checked={rememberMeChecked}
                            onChange={e => setRememberMeChecked(e.target.checked)}
                            classNames={{
                              base: 'text-slate-300',
                              wrapper: 'bg-slate-800/50 border-slate-700',
                            }}
                          >
                            Remember me
                          </Checkbox>
                        </div>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-purple-500/25 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="relative z-10">
                          {isSubmitting ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                        </span>
                        {!isSubmitting && (
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.button>
                    </Form>
                  )}
                </Formik>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {isLogin ? (
                      <>
                        Don't have an account?{' '}
                        <span className="text-purple-400 hover:text-purple-300 font-medium">
                          Sign up
                        </span>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <span className="text-purple-400 hover:text-purple-300 font-medium">
                          Sign in
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthenticateModal;
