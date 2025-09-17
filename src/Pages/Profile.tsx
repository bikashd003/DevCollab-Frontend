import { useMutation, useQuery } from '@apollo/client';
import { Edit3, MapPin, Briefcase, Github, Twitter, Linkedin, Camera, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, Button } from '@nextui-org/react';
import { message, Upload, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { GET_USER_DATA } from '../GraphQL/Queries/Profile/Users';
import UserDetails from '../Components/Profile/UserDetails';
import { useState } from 'react';
import {
  UPDATE_USER_PROFILE_DETAILS,
  UPDATE_USER_PROFILE_PICTURE,
} from '../GraphQL/Mutations/Profile/User';
import BackendApi from '../Constant/Api';
import axios from 'axios';

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
      formData.append('image', file);

      const response = await axios.post<{ imageUrl: string; publicId: string }>(
        `${BackendApi}/cloudinary/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      await updateUserProfilePicture({
        variables: {
          profilePicture: response.data.imageUrl,
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ml-16 lg:ml-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const user = data?.user || {};

  return (
    <div className="min-h-screen ml-16 lg:ml-64 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8"
        >
          {/* Cover Background */}
          <div className="h-48 lg:h-64 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm" />

            {/* Profile Picture */}
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <Avatar
                  src={user.profilePicture}
                  className="w-32 h-32 border-4 border-slate-700 shadow-2xl"
                />
                <Upload
                  showUploadList={false}
                  beforeUpload={file => {
                    handleProfilePictureUpdate(file);
                    return false;
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-2 right-2 p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-lg transition-colors duration-200"
                    disabled={uploading}
                  >
                    <Camera className="w-4 h-4" />
                  </motion.button>
                </Upload>
              </div>
            </div>

            {/* Edit Profile Button */}
            <div className="absolute top-4 right-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded-xl text-white hover:bg-slate-700/80 transition-all duration-200"
              >
                {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">
          {/* Main Profile Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
            >
              {!isEditing ? (
                <div className="space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {user.name || user.username}
                    </h1>
                    <p className="text-slate-400 text-lg">@{user.username}</p>
                  </div>

                  {user.bio && <p className="text-slate-300 leading-relaxed">{user.bio}</p>}

                  <div className="flex flex-wrap gap-4 text-slate-400">
                    {user.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    {user.company && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span>{user.company}</span>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-4 pt-4">
                    {user.github && (
                      <Link
                        to={user.github}
                        className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors duration-200"
                      >
                        <Github className="w-5 h-5 text-slate-300 hover:text-white" />
                      </Link>
                    )}
                    {user.twitter && (
                      <Link
                        to={user.twitter}
                        className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors duration-200"
                      >
                        <Twitter className="w-5 h-5 text-slate-300 hover:text-white" />
                      </Link>
                    )}
                    {user.linkedin && (
                      <Link
                        to={user.linkedin}
                        className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors duration-200"
                      >
                        <Linkedin className="w-5 h-5 text-slate-300 hover:text-white" />
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h2 className="text-xl font-bold text-white mb-4">Edit Profile</h2>
                  <Form
                    form={form}
                    onFinish={handleProfileUpdate}
                    layout="vertical"
                    className="space-y-4"
                  >
                    <Form.Item name="name" label={<span className="text-slate-300">Name</span>}>
                      <Input
                        className="bg-slate-700/50 border-slate-600 text-white"
                        placeholder="Your full name"
                      />
                    </Form.Item>
                    <Form.Item name="bio" label={<span className="text-slate-300">Bio</span>}>
                      <Input.TextArea
                        className="bg-slate-700/50 border-slate-600 text-white"
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    </Form.Item>
                    <Form.Item
                      name="location"
                      label={<span className="text-slate-300">Location</span>}
                    >
                      <Input
                        className="bg-slate-700/50 border-slate-600 text-white"
                        placeholder="Your location"
                      />
                    </Form.Item>
                    <Form.Item
                      name="company"
                      label={<span className="text-slate-300">Company</span>}
                    >
                      <Input
                        className="bg-slate-700/50 border-slate-600 text-white"
                        placeholder="Your company"
                      />
                    </Form.Item>
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none"
                        startContent={<Save className="w-4 h-4" />}
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="bordered"
                        className="border-slate-600 text-slate-300"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </motion.div>
              )}
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {[
                { label: 'Projects', value: '12', color: 'from-purple-500 to-pink-500' },
                { label: 'Skills', value: '8', color: 'from-blue-500 to-cyan-500' },
                { label: 'Connections', value: '24', color: 'from-emerald-500 to-teal-500' },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 text-center"
                >
                  <div
                    className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <UserDetails />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
