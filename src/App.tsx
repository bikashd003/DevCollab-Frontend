
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./Context/ThemeProvider";
import DevCollabHome from './Pages/DevCollabHome';
import './App.css';
import { NextUIProvider } from '@nextui-org/react';
import ProtectedRoute from './Secure/ProtectedRoute';
import Profile from './Pages/Profile';
import useAxiosInterceptors from './Secure/UseAxiosInterceptors';
import PublicRoute from "./Secure/PublicRoute";
import NotFound from "./Pages/NotFound";
import ErrorBoundary from "./Components/ErrorBoundary";
import HomeLayout from "./Components/Profile/HomeLayout";
import Projects from "./Pages/Projects";
import Skills from "./Pages/Skills";
import Questions from "./Pages/Questions";
import AskQuestion from "./Pages/AskQuestion";
import Nav from "./Components/Home/Nav";
import { Outlet } from "react-router-dom";
const MainLayout: React.FC = () => {
  return (
    <div>
      <Nav />
      <Outlet />
    </div>
  );
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <PublicRoute element={<DevCollabHome />} />,
      },
      {
        path: "home",
        element: <ProtectedRoute element={<HomeLayout />} />,
        children: [
          {
            path: ":id",
            element: <ProtectedRoute element={<Profile />} />,
          },
          {
            path: "projects",
            element: <ProtectedRoute element={<Projects />} />,
          },
          {
            path: "skills",
            element: <ProtectedRoute element={<Skills />} />,
          },
        ],
      },
    ],
  },
  {
    path: "/questions",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Questions />,
      },
      {
        path: "ask",
        element: <AskQuestion />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);


const App = () => {
  useAxiosInterceptors();

  return (
    <NextUIProvider>
      <ThemeProvider>
      <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </ThemeProvider>
    </NextUIProvider>
  );
};

export default App;
