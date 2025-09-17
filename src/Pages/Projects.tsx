import { useMutation } from '@apollo/client';
import { Button, Input, Textarea } from '@nextui-org/react';
import type { UploadFile } from 'antd';
import { toast } from 'sonner';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Code2, ExternalLink, Upload, Zap } from 'lucide-react';
import FileInput from '../Components/Global/FileInput';
import ADD_PROJECT_MUTATION from '../GraphQL/Mutations/Profile/Projects';
const Projects: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [createProject, { loading, error }] = useMutation(ADD_PROJECT_MUTATION, {
    onCompleted: () => {
      setTitle('');
      setDescription('');
      setImageUrl(null);
      setProjectLink('');
      setFileList([]);
      toast.success('Project added successfully');
    },
  });
  const handleFileChange = (imageUrl: string | null) => {
    setImageUrl(imageUrl);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createProject({
        variables: {
          title,
          description,
          imageUrl: imageUrl || '',
          projectLink,
        },
      });
    } catch (err) {
      // console.error('Error adding project:', err);
    }
  };

  return (
    <div className="min-h-screen ml-16 lg:ml-64 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Projects</h1>
              <p className="text-slate-400">Showcase your amazing work</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Project Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Create New Project</h2>
                  <p className="text-slate-400 text-sm">Add your latest creation</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium text-slate-300">
                  Project Title
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="My Awesome Project"
                  className="w-full"
                  classNames={{
                    input: 'bg-slate-700/50 text-white placeholder:text-slate-400',
                    inputWrapper:
                      'bg-slate-700/50 border-slate-600 hover:border-slate-500 focus-within:border-purple-500',
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-slate-300">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={description}
                  placeholder="Describe your project, technologies used, and key features..."
                  onChange={e => setDescription(e.target.value)}
                  className="w-full"
                  classNames={{
                    input: 'bg-slate-700/50 text-white placeholder:text-slate-400',
                    inputWrapper:
                      'bg-slate-700/50 border-slate-600 hover:border-slate-500 focus-within:border-purple-500',
                  }}
                  minRows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="projectLink" className="block text-sm font-medium text-slate-300">
                  Project Link
                </label>
                <Input
                  id="projectLink"
                  value={projectLink}
                  onChange={e => setProjectLink(e.target.value)}
                  placeholder="https://github.com/yourusername/project"
                  className="w-full"
                  classNames={{
                    input: 'bg-slate-700/50 text-white placeholder:text-slate-400',
                    inputWrapper:
                      'bg-slate-700/50 border-slate-600 hover:border-slate-500 focus-within:border-purple-500',
                  }}
                  startContent={<ExternalLink className="w-4 h-4 text-slate-400" />}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Project Image</label>
                <div className="p-4 border-2 border-dashed border-slate-600 rounded-xl bg-slate-700/20">
                  <FileInput
                    onChange={handleFileChange}
                    accept="image/png,image/jpeg"
                    maxSize={2 * 1024 * 1024}
                    fileList={fileList}
                    setFileList={setFileList}
                  />
                  <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    Max size: 2MB, Formats: PNG, JPEG
                  </p>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 shadow-lg hover:shadow-purple-500/25"
                  disabled={loading}
                  startContent={
                    loading ? (
                      <Zap className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )
                  }
                >
                  {loading ? 'Creating Project...' : 'Create Project'}
                </Button>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <p className="text-red-400 text-sm">Error: {error.message}</p>
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Projects Preview/List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Your Projects</h3>
                <p className="text-slate-400 text-sm">Recent creations</p>
              </div>
            </div>

            {/* Placeholder for projects list */}
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                      <Code2 className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">Project {i}</h4>
                      <p className="text-slate-400 text-sm mb-2">
                        A brief description of this amazing project...
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                          React
                        </span>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                          TypeScript
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
