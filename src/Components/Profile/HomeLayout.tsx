import { Outlet, ScrollRestoration } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';

const HomeLayout = () => {
  return (
    <div className="flex">
      <div className="flex-grow">
        <Outlet />
      </div>
      <LeftSidebar />
      <ScrollRestoration />
    </div>
  );
};

export default HomeLayout;
