import { Outlet } from 'react-router-dom';
import RightSidebar from './RightSidebar';

const HomeLayout = () => {
  return (
    <div className="flex">
      <div className="flex-grow">
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  );
};

export default HomeLayout;