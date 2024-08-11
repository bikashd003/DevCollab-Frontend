
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./Context/ThemeProvider";
import DevLearnPage from './Pages/DevLearnPage';
import './App.css';
import { NextUIProvider } from '@nextui-org/react';
import ProtectedRoute from './Secure/ProtectedRoute';
import Profile from './Pages/Profile';
import useAxiosInterceptors from './Secure/UseAxiosInterceptors';
import PublicRoute from "./Secure/PublicRoute";
import NotFound from "./Pages/NotFound";
import ErrorBoundary from "./Components/ErrorBoundary";
import HomeLayout from "./Components/Profile/HomeLayout";
import ProjectInput from "./Components/Profile/ProjectInput";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: <PublicRoute element={<DevLearnPage />} />,
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
            element: <ProjectInput />,
          },

        ],
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
