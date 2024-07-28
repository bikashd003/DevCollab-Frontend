import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./Context/ThemeProvider";
import DevLearnPage from './Pages/DevLearnPage';
import './App.css';
import { NextUIProvider } from '@nextui-org/react'

const router = createBrowserRouter([
  {
    path: "/",
    element: <DevLearnPage />,
  },
]);

const App = () => {
  return (
    <NextUIProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </NextUIProvider>
  );
};

export default App;