import { useMutation, useQuery } from '@apollo/client';
import { PencilIcon } from 'lucide-react';
import { Avatar, Button, Popover, message, Upload, Form, Input } from 'antd';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';
import { FiBriefcase } from 'react-icons/fi';
import { IoLocate } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { GET_USER_DATA } from '../GraphQL/Queries/Profile/Users';
import UserDetails from '../Components/Profile/UserDetails';
import { useState } from 'react';
import {
  UPDATE_USER_PROFILE_DETAILS,
  UPDATE_USER_PROFILE_PICTURE,
} from '../GraphQL/Mutations/Profile/User';

const Profile = () => {
  const { data, loading, refetch } = useQuery(GET_USER_DATA);
  const [updateUserProfilePicture] = useMutation(UPDATE_USER_PROFILE_PICTURE);
  const [updateUserProfileDetails] = useMutation(UPDATE_USER_PROFILE_DETAILS);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const [uploading, setUploading] = useState(false);

  // Handle profile picture upload
  const handleProfilePictureUpdate = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      // Assuming you have an API endpoint for file upload
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const { url } = await response.json();

      await updateUserProfilePicture({
        variables: {
          profilePicture: url,
        },
      });

      message.success('Profile picture updated successfully');
      refetch();
    } catch (error) {
      message.error('Failed to update profile picture');
    } finally {
      setUploading(false);
    }
  };

  // Handle profile details update
  const handleProfileUpdate = async (values: unknown) => {
    try {
      await updateUserProfileDetails({
        variables: {
          input: values,
        },
      });
      message.success('Profile updated successfully');
      setIsEditing(false);
      refetch();
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  if (loading) return <div>Loading...</div>;

  const user = data?.user || {};

  return (
    <div className="h-full">
      <div className="flex max-w-4xl justify-center md:max-w-6xl h-full mx-auto p-6 md:p-10">
        <div className="w-full md:w-2/4">
          <div className="w-full md:w-2/3 flex flex-col items-center relative">
            <Avatar
              size={{ xs: 100, sm: 80, md: 100, lg: 200, xl: 200, xxl: 250 }}
              src={user.profilePicture}
            />
            <Popover
              placement="bottom"
              trigger="click"
              content={
                <Upload
                  showUploadList={false}
                  beforeUpload={file => {
                    handleProfilePictureUpdate(file);
                    return false;
                  }}
                >
                  <div className="cursor-pointer">
                    <p>Upload a photo</p>
                  </div>
                </Upload>
              }
            >
              <Button
                className="absolute bottom-0 right-4"
                icon={<PencilIcon />}
                loading={uploading}
              >
                Edit
              </Button>
            </Popover>
          </div>
          <div className="w-full md:w-2/3 flex flex-col gap-4">
            <div className="grid gap-1">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <div className="text-muted-foreground">@{user.username}</div>
              <Button onClick={() => setIsEditing(prev => !prev)}>Edit Profile</Button>
            </div>
            <div className={`grid gap-2 ${isEditing ? 'hidden' : ''}`}>
              <p>{user.bio}</p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <IoLocate className="w-5 h-5" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FiBriefcase className="w-5 h-5" />
                <span>{user.company}</span>
              </div>
            </div>
            <div className={`flex items-center gap-4 ${isEditing ? 'hidden' : ''}`}>
              {user.github && (
                <Link to={user.github} className="text-primary hover:underline">
                  <FaGithub className="w-6 h-6" />
                </Link>
              )}
              {user.twitter && (
                <Link to={user.twitter} className="text-primary hover:underline">
                  <FaSquareXTwitter className="w-6 h-6" />
                </Link>
              )}
              {user.linkedin && (
                <Link to={user.linkedin} className="text-primary hover:underline">
                  <FaLinkedin className="w-6 h-6" />
                </Link>
              )}
            </div>
            <div className={`${isEditing ? '' : 'hidden'}`}>
              <Form form={form} onFinish={handleProfileUpdate}>
                <Form.Item name="name" label="Name">
                  <Input />
                </Form.Item>
                <Form.Item name="bio" label="Bio">
                  <Input.TextArea />
                </Form.Item>
                <Form.Item name="location" label="Location">
                  <Input />
                </Form.Item>
                <Form.Item name="company" label="Company">
                  <Input />
                </Form.Item>
                <div className="flex items-center gap-2">
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>
                  </Form.Item>
                  <Button onClick={() => setIsEditing(prev => !prev)}>Cancel</Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
        <UserDetails />
      </div>
    </div>
  );
};

export default Profile;
