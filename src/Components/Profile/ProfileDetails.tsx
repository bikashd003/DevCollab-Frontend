import { useQuery } from '@apollo/client';
import { Skeleton } from '@nextui-org/react';
import { Avatar } from 'antd';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';
import { FiBriefcase } from 'react-icons/fi';
import { IoLocate } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { GET_USER_DATA } from '../../GraphQL/Queries/Users';
import UserDetails from './UserDetails';
const ProfileDetails: React.FC = () => {
  const { loading, data } = useQuery(GET_USER_DATA);

  return (
    <div className={`flex max-w-4xl justify-center md:max-w-6xl h-full mx-auto p-6 md:p-10`}>
      <div className="w-full md:w-2/4">
        <div className="w-full md:w-2/3 flex flex-col items-center">
          <Skeleton isLoaded={!loading} className="rounded-full">
            <Avatar
              size={{ xs: 100, sm: 80, md: 100, lg: 200, xl: 200, xxl: 250 }}
              src={data?.user?.profilePicture}
            />
          </Skeleton>
        </div>
        <div className="w-full md:w-2/3 flex flex-col gap-4">
          <div className="grid gap-1">
            <h1 className="text-2xl font-bold">John Doe</h1>
            <div className="text-muted-foreground">@johndoe</div>
          </div>
          <div className="grid gap-2">
            <p>
              I am a passionate software engineer with a love for building innovative products. In
              my free time, I enjoy exploring new technologies and contributing to open-source
              projects.
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <IoLocate className="w-5 h-5" />
              <span>San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <FiBriefcase className="w-5 h-5" />
              <span>Software Engineer at Acme Inc.</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="#" className="text-primary hover:underline">
              <FaGithub className="w-6 h-6" />
            </Link>
            <Link to="#" className="text-primary hover:underline">
              <FaSquareXTwitter className="w-6 h-6" />
            </Link>
            <Link to="#" className="text-primary hover:underline">
              <FaLinkedin className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
      <UserDetails />
    </div>
  );
};

export default ProfileDetails;
