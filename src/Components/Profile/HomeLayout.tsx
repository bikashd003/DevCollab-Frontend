import { Outlet } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';

const HomeLayout = () => {
  return (
    <div className="flex">
      <div className="flex-grow">
        <Outlet />
      </div>
      <LeftSidebar />
    </div>
  );
};

export default HomeLayout;