
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./Context/ThemeProvider";
import DevLearnPage from './Pages/DevLearnPage';
import './App.css';
import { NextUIProvider } from '@nextui-org/react';
import ProtectedRoute from './Secure/ProtectedRoute';
import Profile from './Pages/Profile';
import useAxiosInterceptors from './Secure/UseAxiosInterceptors';

const router = createBrowserRouter([
  {
    path: "/",
    element: <DevLearnPage />,
  },
  {
    path: "/profile/user",
    element: <ProtectedRoute element={<Profile />} />,
  },
  {
    path: "*",
    element: <div>Not found</div>, 
  },
]);


const App = () => {
  useAxiosInterceptors();

  return (
    <NextUIProvider>
      <ThemeProvider>
          <RouterProvider router={router} />
      </ThemeProvider>
    </NextUIProvider>
  );
};

export default App;
