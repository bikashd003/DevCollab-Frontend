import { Avatar } from 'antd';
// import { FiEdit } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/Store';
// import {motion} from 'framer-motion';
import { IoLocate } from "react-icons/io5";
import { FiBriefcase } from "react-icons/fi";
import { FaGithub } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
const ProfileDetails: React.FC = () => {
    const isCollapsed = useSelector((state: RootState) => state.profile.isCollapsed);
    const userDetails = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        bio: 'Software Developer | React Enthusiast',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
        location: 'New York, USA',
        joinDate: 'January 2022',
    };
    return (
        <div className={`flex items-start gap-8 max-w-4xl ${isCollapsed ? 'ml-[4rem]' : 'ml-[12rem]'} p-6 md:p-10 flex-col`}>
            <div className="w-full md:w-2/3">
                <Avatar
                    size={{ xs: 100, sm: 80, md: 100, lg: 200, xl: 200, xxl: 300 }}
                    src={userDetails.avatar}
                />
            </div>
            <div className="w-full md:w-2/3 grid gap-4">
                <div className="grid gap-1">
                    <h1 className="text-2xl font-bold">John Doe</h1>
                    <div className="text-muted-foreground">@johndoe</div>
                </div>
                <div className="grid gap-2">
                    <p>
                        I'm a passionate software engineer with a love for building innovative products. In my free time, I enjoy
                        exploring new technologies and contributing to open-source projects.
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
                    <Link to="#" className="text-primary hover:underline" >
                        <FaLinkedin className="w-6 h-6" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProfileDetails;