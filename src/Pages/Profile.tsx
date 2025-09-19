import { useMutation, useQuery } from '@apollo/client';
import { Edit3, Camera, Save, X, Mail, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Avatar, Button } from '@nextui-org/react';
import { message, Upload, Form, Input } from 'antd';
import { GET_USER_DATA } from '../GraphQL/Queries/Profile/Users';
import PageContainer from '../Components/Profile/PageContainer';
import LoadingSpinner from '../Components/Global/LoadingSpinner';
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

  const handleProfileUpdate = async (values: any) => {
    try {
      const socialLinks = [];
      if (values.github) socialLinks.push(values.github);
      if (values.twitter) socialLinks.push(values.twitter);
      if (values.linkedin) socialLinks.push(values.linkedin);

      await updateUserProfileDetails({
        variables: {
          input: {
            name: values.name,
            bio: values.bio,
            location: values.location,
            company: values.company,
            socialLinks,
          },
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
      <PageContainer>
        <div className="flex items-center justify-center min-h-[50vh]">
          <LoadingSpinner size="lg" />
        </div>
      </PageContainer>
    );
  }

  const user = data?.user || {};
  const socialLinks = user.socialLinks || [];
  const github = socialLinks.find((link: string) => link.includes('github.com'));
  const twitter = socialLinks.find(
    (link: string) => link.includes('twitter.com') || link.includes('x.com')
  );
  const linkedin = socialLinks.find((link: string) => link.includes('linkedin.com'));

  return (
    <PageContainer>
      <div className="w-full max-w-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden mb-8"
        >
          <div className="h-40 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 via-blue-600/90 to-cyan-600/90" />
            <div className="absolute top-6 right-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300"
              >
                {isEditing ? <X className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                <span className="font-medium">{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </motion.button>
            </div>
          </div>

          <div className="px-8 pb-8 -mt-20 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end gap-8 mb-8">
              <div className="relative">
                <div className="w-40 h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-slate-800">
                  <Avatar
                    src={user.profilePicture}
                    className="w-full h-full object-cover"
                    fallback={
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-4xl font-bold text-white">
                        {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                      </div>
                    }
                  />
                </div>
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
                    className="absolute bottom-2 right-2 p-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full shadow-lg transition-all duration-200"
                    disabled={uploading}
                  >
                    <Camera className="w-5 h-5" />
                  </motion.button>
                </Upload>
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {user.name || user.username || 'User'}
                </h1>
                <p className="text-slate-300 text-xl mb-4">@{user.username || 'username'}</p>

                <div className="flex flex-wrap gap-6 text-sm mb-6">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.location && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(user.createdAt).getFullYear()}</span>
                  </div>
                </div>

                <div className="flex gap-8 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {user.projects?.length || 0}
                    </div>
                    <div className="text-slate-400">Projects</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{user.skills?.length || 0}</div>
                    <div className="text-slate-400">Skills</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">156</div>
                    <div className="text-slate-400">Connections</div>
                  </div>
                </div>
              </div>
            </div>

            {!isEditing ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {user.bio && (
                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
                      <h3 className="text-xl font-semibold text-white mb-4">About</h3>
                      <p className="text-slate-300 leading-relaxed text-lg">{user.bio}</p>
                    </div>
                  )}

                  <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-6">Projects</h3>
                    {user.projects?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.projects.map((project: any) => (
                          <motion.div
                            key={project.id}
                            whileHover={{ scale: 1.02 }}
                            className="bg-slate-900/50 border border-slate-600/50 rounded-xl p-4 hover:border-purple-500/50 transition-all duration-200"
                          >
                            {project.imageUrl && (
                              <img
                                src={project.imageUrl}
                                alt={project.title}
                                className="w-full h-32 object-cover rounded-lg mb-3"
                              />
                            )}
                            <h4 className="text-white font-semibold mb-2">{project.title}</h4>
                            <p className="text-slate-400 text-sm mb-3">{project.description}</p>
                            {project.projectLink && (
                              <a
                                href={project.projectLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm"
                              >
                                <ExternalLink className="w-4 h-4" />
                                View Project
                              </a>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-400">
                        <p>No projects to display</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
                    <h4 className="text-white font-semibold mb-4">Skills</h4>
                    {user.skills?.length > 0 ? (
                      <div className="space-y-3">
                        {user.skills.map((skill: any) => (
                          <div key={skill.id} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-300">{skill.title}</span>
                              <span className="text-slate-400">{skill.proficiency}%</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${skill.proficiency}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-center py-4">No skills added</p>
                    )}
                  </div>

                  {(github || twitter || linkedin) && (
                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
                      <h4 className="text-white font-semibold mb-4">Social Links</h4>
                      <div className="space-y-3">
                        {github && (
                          <a
                            href={github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-slate-900/50 hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 rounded-xl transition-all duration-200 group"
                          >
                            <FaGithub className="w-5 h-5 text-slate-400 group-hover:text-white" />
                            <span className="text-slate-300 group-hover:text-white">GitHub</span>
                          </a>
                        )}
                        {twitter && (
                          <a
                            href={twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-slate-900/50 hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 rounded-xl transition-all duration-200 group"
                          >
                            <FaTwitter className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
                            <span className="text-slate-300 group-hover:text-white">Twitter</span>
                          </a>
                        )}
                        {linkedin && (
                          <a
                            href={linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 bg-slate-900/50 hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 rounded-xl transition-all duration-200 group"
                          >
                            <FaLinkedin className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                            <span className="text-slate-300 group-hover:text-white">LinkedIn</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6"
              >
                <h3 className="text-2xl font-semibold text-white mb-6">Edit Profile</h3>
                <Form
                  form={form}
                  onFinish={handleProfileUpdate}
                  layout="vertical"
                  initialValues={{
                    ...user,
                    github,
                    twitter,
                    linkedin,
                  }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Form.Item
                      name="name"
                      label={<span className="text-slate-300 font-medium">Full Name</span>}
                    >
                      <Input
                        className="bg-slate-900/50 border-slate-600 text-white rounded-lg h-12"
                        placeholder="Enter your full name"
                      />
                    </Form.Item>
                    <Form.Item
                      name="location"
                      label={<span className="text-slate-300 font-medium">Location</span>}
                    >
                      <Input
                        className="bg-slate-900/50 border-slate-600 text-white rounded-lg h-12"
                        placeholder="Your current location"
                      />
                    </Form.Item>
                  </div>

                  <Form.Item
                    name="bio"
                    label={<span className="text-slate-300 font-medium">Bio</span>}
                  >
                    <Input.TextArea
                      className="bg-slate-900/50 border-slate-600 text-white rounded-lg"
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </Form.Item>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Form.Item
                      name="github"
                      label={<span className="text-slate-300 font-medium">GitHub URL</span>}
                    >
                      <Input
                        className="bg-slate-900/50 border-slate-600 text-white rounded-lg h-12"
                        placeholder="https://github.com/username"
                      />
                    </Form.Item>
                    <Form.Item
                      name="twitter"
                      label={<span className="text-slate-300 font-medium">Twitter URL</span>}
                    >
                      <Input
                        className="bg-slate-900/50 border-slate-600 text-white rounded-lg h-12"
                        placeholder="https://twitter.com/username"
                      />
                    </Form.Item>
                    <Form.Item
                      name="linkedin"
                      label={<span className="text-slate-300 font-medium">LinkedIn URL</span>}
                    >
                      <Input
                        className="bg-slate-900/50 border-slate-600 text-white rounded-lg h-12"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </Form.Item>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-none px-8 h-12"
                      startContent={<Save className="w-5 h-5" />}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="bordered"
                      className="border-slate-600 text-slate-300 hover:bg-slate-800/50 h-12 px-8"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
};

export default Profile;
