import React from 'react';
import { createBrowserRouter, RouterProvider, ScrollRestoration } from 'react-router-dom';
import { ThemeProvider } from './Context/ThemeProvider';
import DevCollabHome from './Pages/DevCollabHome';
import './App.css';
import { NextUIProvider } from '@nextui-org/react';
import ProtectedRoute from './Secure/ProtectedRoute';
import Profile from './Pages/Profile';
import NotFound from './Pages/NotFound';
import RouteErrorBoundary from './Components/RouteErrorBoundary';
import HomeLayout from './Components/Profile/HomeLayout';
import Projects from './Pages/Projects';
import Skills from './Pages/Skills';
import Questions from './Pages/Questions';
import AskQuestion from './Pages/AskQuestion';
import Nav from './Components/Home/Nav';
import { Outlet } from 'react-router-dom';
import Footer from './Components/Home/Footer';
import AboutPage from './Pages/AboutPage';
import BlogPage from './Pages/BlogPage';
import BlogDetails from './Pages/BlogDetails';
import ErrorBoundary from './Components/ErrorBoundary';
import CodeTogetherPage from './Pages/CodeTogetherPage';
import QuestionDetails from './Pages/QuestionDetails';
import EditorHomePage from './Pages/EditorHomePage';
import { ConfirmProvider } from './Components/Global/ConfirmProvider';
import { TipsProvider } from './Components/Tips/Tips';
import { Toaster } from 'sonner';

const MainLayout: React.FC = () => {
  return (
    <div>
      <Nav />
      <Outlet />
      <Footer />
      <ScrollRestoration />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <DevCollabHome />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'blogs',
        element: <BlogPage />,
      },
      {
        path: 'blog/:id',
        element: <BlogDetails />,
      },
    ],
  },
  {
    path: '/editor/:id',
    element: <ProtectedRoute element={<CodeTogetherPage />} />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: 'editor',
    element: <EditorHomePage />,
  },
  {
    path: '/home',
    element: <ProtectedRoute element={<HomeLayout />} />,
    children: [
      {
        path: ':id',
        element: <ProtectedRoute element={<Profile />} />,
      },
      {
        path: 'projects',
        element: <ProtectedRoute element={<Projects />} />,
      },
      {
        path: 'skills',
        element: <ProtectedRoute element={<Skills />} />,
      },
    ],
  },
  {
    path: '/questions',
    element: <MainLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <Questions />,
      },
      {
        path: ':id',
        element: <QuestionDetails />,
      },
      {
        path: 'ask',
        element: <AskQuestion />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

const App = () => {
  return (
    <ErrorBoundary>
      <NextUIProvider>
        <Toaster richColors closeButton />
        <TipsProvider>
          <ThemeProvider>
            <ConfirmProvider>
              <RouterProvider router={router} />
            </ConfirmProvider>
          </ThemeProvider>
        </TipsProvider>
      </NextUIProvider>
    </ErrorBoundary>
  );
};

export default App;
