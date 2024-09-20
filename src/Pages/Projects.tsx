import { useMutation } from '@apollo/client';
import { Button, Input, Textarea } from '@nextui-org/react';
import type { UploadFile } from 'antd';
import { message } from 'antd';
import React, { useState } from 'react';
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
      message.success('Project added successfully');
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
    <div className="min-h-screen bg-gray-900 text-green-400 font-mono flex items-center justify-center p-4 sm:p-6 md:p-8 ml-0 min-[320px]:ml-16 min-[760px]:ml-40">
      <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg overflow-hidden mx-auto sm:mx-4 md:mx-8">
        <div className="p-4 bg-gray-700 border-b border-gray-600">
          <h2 className="text-xl font-semibold">
            New Project <span className="text-yellow-400">{`{`}</span>
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm">
              title<span className="text-yellow-400">:</span>
            </label>
            <Input
              id="title"
              value={title}
              variant="bordered"
              onChange={e => setTitle(e.target.value)}
              className="w-full"
              placeholder="'My Awesome Project'"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm">
              description<span className="text-yellow-400">:</span>
            </label>
            <Textarea
              id="description"
              variant="bordered"
              value={description}
              placeholder="'This is my awesome project...'"
              onChange={e => setDescription(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="projectLink" className="block text-sm">
              link<span className="text-yellow-400">:</span>
            </label>
            <Input
              id="projectLink"
              variant="bordered"
              value={projectLink}
              onChange={e => setProjectLink(e.target.value)}
              className="w-full"
              placeholder="'https://github.com/yourusername/project'"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm">
              image<span className="text-yellow-400">:</span>
            </label>
            <FileInput
              onChange={handleFileChange}
              accept="image/png,image/jpeg"
              maxSize={2 * 1024 * 1024}
              fileList={fileList}
              setFileList={setFileList}
            />
            <p className="text-xs text-gray-400">{`// Max size: 2MB, Formats: PNG, JPEG`}</p>
          </div>
          <div className="pt-4">
            <Button
              type="submit"
              color="success"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? 'Compiling...' : 'Run Project.create()'}
            </Button>
          </div>
          {error && <p className="text-red-500 mt-2">{`// Error: ${error}`}</p>}
        </form>
        <div className="p-4 bottom-0 bg-gray-700 border-t border-gray-600">
          <span className="text-yellow-400">{`}`}</span>
        </div>
      </div>
    </div>
  );
};

export default Projects;
