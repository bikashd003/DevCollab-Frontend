import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './Context/ThemeProvider';
import DevCollabHome from './Pages/DevCollabHome';
import './App.css';
import { NextUIProvider } from '@nextui-org/react';
import ProtectedRoute from './Secure/ProtectedRoute';
import Profile from './Pages/Profile';
// import useAxiosInterceptors from './Secure/UseAxiosInterceptors';
// import PublicRoute from './Secure/PublicRoute';
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
const MainLayout: React.FC = () => {
  return (
    <div>
      <Nav />
      <Outlet />
      <Footer />
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
      {
        path: 'code-together',
        element: <ProtectedRoute element={<CodeTogetherPage />} />,
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
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </NextUIProvider>
    </ErrorBoundary>
  );
};

export default App;
