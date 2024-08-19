import React, { useEffect, useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";
import { IoCloseSharp } from "react-icons/io5";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import SignupSchema from '../../Schemas/SignupSchema';
import LoginSchema from '../../Schemas/LoginSchema';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import axios from 'axios';
import BackendApi from "../../Constant/Api"
interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}
type FormValues =
    | { type: 'login'; email: string; password: string }
    | { type: 'signup'; fullName: string; email: string; password: string; confirmPassword: string };

const AuthenticateModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [githubAuthUrl, setGithubAuthUrl] = useState('');
    
    const handleSubmit = (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
        // Handle form submission
        console.log(values);
        setSubmitting(false);
    };
    const initialValues: FormValues = isLogin
    ? { type: 'login', email: '', password: '' }
        : { type: 'signup', fullName: '', email: '', password: '', confirmPassword: '' };
        
        useEffect(() => {
            axios.get(`${BackendApi}/auth/github/url`)
            .then(response => setGithubAuthUrl(response.data.url))
            .catch(error => console.error('Error fetching GitHub auth URL:', error));
        }, []);
        useEffect(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            
            if (code) {
                axios.get(`${BackendApi}/auth/github/callback?code=${code}`)
                    .then(response => {
                        console.log('Authenticated with GitHub:', response.data);
                    })
                    .catch(error => console.error('Error authenticating with GitHub:', error));
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [window.location.search]);  

        const handleGithubAuth = () => {
            if (githubAuthUrl) {
                window.location.href = githubAuthUrl;
            } else {
                console.error('GitHub authentication URL not available');
            }
        };
        
        const handleGoogleAuth = () => {
            // Implement GitHub authentication logic
            console.log('GitHub authentication');
        };
        if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-md p-6 rounded-lg shadow-xl bg-white dark:bg-dark-background">
                <h2 className="mb-4 text-2xl font-bold text-center text-foreground dark:text-dark-foreground">
                    {isLogin ? 'Login' : 'Sign Up'}
                </h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={isLogin ? LoginSchema : SignupSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched }) => (
                        <Form className="space-y-4">
                            {!isLogin && (
                                <div>
                                    <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-700 dark:text-dark-foreground">
                                        Full Name
                                    </label>
                                    <Field
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        className={`w-full px-3 py-2 text-gray-700 bg-gray-200 border rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 ${!isLogin && 'fullName' in errors && 'fullName' in touched && errors.fullName && touched.fullName ? 'border-red-500' : ''
                                            }`}
                                    />
                                    <ErrorMessage name="fullName" component="div" className="mt-1 text-sm text-red-500" />
                                </div>
                            )}
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email
                                </label>
                                <Field
                                    type="email"
                                    id="email"
                                    name="email"
                                    className={`w-full px-3 py-2 text-gray-700 bg-gray-200 border rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 ${errors.email && touched.email ? 'border-red-500' : ''
                                        }`}
                                />
                                <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-500" />
                            </div>
                            <div className='relative'>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Password
                                </label>
                                <Field
                                     type={isVisible ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    className={`w-full px-3 py-2 text-gray-700 bg-gray-200 border rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 ${errors.password && touched.password ? 'border-red-500' : ''
                                        }`}
                                />
                                 <button className="focus:outline-none absolute right-3 top-[2.5rem]" type="button" onClick={() => setIsVisible(!isVisible)} >
                                        {isVisible ? (
                                            <FaRegEye size={20}/>
                                        ) : (
                                            <FaRegEyeSlash size={20}/>
                                        )}
                                    </button>
                                <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-500" />
                            </div>
                            {!isLogin && (
                                <div className='relative'>
                                    <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Confirm Password
                                    </label>
                                    <Field
                                        type={isVisible ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className={`w-full px-3 py-2 text-gray-700 bg-gray-200 border rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 ${!isLogin && 'confirmPassword' in errors && 'confirmPassword' in touched && errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''
                                            }`}
                                    />
                                    <button className="focus:outline-none absolute right-3 top-[2.5rem]" type="button" onClick={() => setIsVisible(!isVisible)} >
                                        {isVisible ? (
                                            <FaRegEye size={20}/>
                                        ) : (
                                            <FaRegEyeSlash size={20}/>
                                        )}
                                    </button>
                                    <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-500" />
                                </div>
                            )}
                            <button
                                type="submit"
                                className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:shadow-outline dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                                {isLogin ? 'Login' : 'Sign Up'}
                            </button>
                        </Form>
                    )}
                </Formik>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Or continue with</p>
                    <div className="flex justify-center mt-2 space-x-4">
                        <button
                            onClick={handleGoogleAuth}
                            className="flex items-center justify-center w-12 h-12 text-white bg-gray-800 rounded-full hover:bg-gray-900 focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            <FcGoogle className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handleGithubAuth}
                            className="flex items-center justify-center w-12 h-12 text-white bg-gray-800 rounded-full hover:bg-gray-900 focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            <FaGithub className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
                    </button>
                </div>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <IoCloseSharp />
                </button>
            </div>
        </div>
    );
};

export default AuthenticateModal;