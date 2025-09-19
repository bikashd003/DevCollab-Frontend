import { useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Input,
  Textarea,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@nextui-org/react';
import { toast } from 'sonner';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Code2, ExternalLink, Edit3, Trash2, Github, Globe, FolderPlus } from 'lucide-react';
import FileInput, { type UploadFile } from '../Components/Global/FileInput';
import PageContainer from '../Components/Profile/PageContainer';
import ADD_PROJECT_MUTATION, {
  DELETE_PROJECT,
  UPDATE_PROJECT,
} from '../GraphQL/Mutations/Profile/Projects';
import { GET_USER_DATA } from '../GraphQL/Queries/Profile/Users';

interface Project {
  id?: string;
  title: string;
  description: string;
  imageUrl?: string;
  projectLink: string;
}
const Projects: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const { data, loading: projectsLoading, refetch } = useQuery(GET_USER_DATA);
  const [createProject, { loading: createLoading }] = useMutation(ADD_PROJECT_MUTATION, {
    onCompleted: () => {
      resetForm();
      setShowCreateForm(false);
      toast.success('Project created successfully');
      refetch();
    },
    onError: error => {
      toast.error(`Failed to create project: ${error.message}`);
    },
  });

  const [updateProject, { loading: updateLoading }] = useMutation(UPDATE_PROJECT, {
    onCompleted: () => {
      resetForm();
      setEditingProject(null);
      toast.success('Project updated successfully');
      refetch();
    },
    onError: error => {
      toast.error(`Failed to update project: ${error.message}`);
    },
  });

  const [deleteProject, { loading: deleteLoading }] = useMutation(DELETE_PROJECT, {
    onCompleted: () => {
      setDeleteModalOpen(false);
      setProjectToDelete(null);
      toast.success('Project deleted successfully');
      refetch();
    },
    onError: error => {
      toast.error(`Failed to delete project: ${error.message}`);
    },
  });

  const projects = data?.user?.projects || [];

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImageUrl(null);
    setProjectLink('');
    setFileList([]);
  };
  const handleFileChange = (imageUrl: string | null) => {
    setImageUrl(imageUrl);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !projectLink.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingProject) {
        await updateProject({
          variables: {
            id: editingProject.id,
            title: title.trim(),
            description: description.trim(),
            imageUrl: imageUrl || '',
            projectLink: projectLink.trim(),
          },
        });
      } else {
        await createProject({
          variables: {
            title: title.trim(),
            description: description.trim(),
            imageUrl: imageUrl || '',
            projectLink: projectLink.trim(),
          },
        });
      }
    } catch (err: any) {
      toast.error(`Failed to ${editingProject ? 'update' : 'create'} project: ${err.message}`);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setProjectLink(project.projectLink);
    setImageUrl(project.imageUrl || null);
    setShowCreateForm(true);
  };

  const handleDelete = (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (projectToDelete) {
      await deleteProject({
        variables: { id: projectToDelete },
      });
    }
  };

  const handleCancel = () => {
    resetForm();
    setEditingProject(null);
    setShowCreateForm(false);
  };

  const getProjectIcon = (link: string) => {
    if (link.includes('github.com')) return <Github className="w-4 h-4" />;
    if (link.includes('vercel.app') || link.includes('netlify.app'))
      return <Globe className="w-4 h-4" />;
    return <ExternalLink className="w-4 h-4" />;
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <AnimatePresence>
          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 animate-pulse"
                >
                  <div className="w-full h-32 bg-slate-700/50 rounded-lg mb-4"></div>
                  <div className="h-4 bg-slate-700/50 rounded mb-2"></div>
                  <div className="h-3 bg-slate-700/50 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-slate-700/50 rounded-full"></div>
                    <div className="h-6 w-20 bg-slate-700/50 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 bg-slate-700/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FolderPlus className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
              <p className="text-slate-400 mb-6">
                Start building your portfolio by adding your first project
              </p>
              <Button
                onPress={() => setShowCreateForm(true)}
                className="bg-slate-700 hover:bg-slate-600 text-white"
                startContent={<Plus className="w-4 h-4" />}
              >
                Create Your First Project
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project: Project, index: number) => (
                <motion.div
                  key={project.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start w-full">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center">
                            <Code2 className="w-5 h-5 text-slate-300" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-left">{project.title}</h3>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => handleEdit(project)}
                            className="text-slate-400 hover:text-white"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => handleDelete(project.id!)}
                            className="text-slate-400 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody className="pt-0">
                      {project.imageUrl && (
                        <div className="w-full h-32 mb-4 rounded-lg overflow-hidden bg-slate-700/30">
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Chip
                          size="sm"
                          className="bg-slate-700/50 text-slate-300"
                          startContent={getProjectIcon(project.projectLink)}
                        >
                          View Project
                        </Chip>
                        <Button
                          as="a"
                          href={project.projectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="sm"
                          variant="light"
                          className="text-slate-400 hover:text-white"
                          endContent={<ExternalLink className="w-3 h-3" />}
                        >
                          Open
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        <Modal
          isOpen={showCreateForm}
          onClose={handleCancel}
          size="2xl"
          classNames={{
            backdrop: 'bg-black/50 backdrop-blur-sm',
            base: 'border border-slate-700/50 bg-slate-900',
            header: 'border-b border-slate-700/50',
            body: 'py-6',
            footer: 'border-t border-slate-700/50',
          }}
        >
          <ModalContent>
            <ModalHeader>
              <div className="flex items-center gap-2">
                {editingProject ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </div>
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Project Title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="My Awesome Project"
                  classNames={{
                    input: 'bg-slate-800 text-white',
                    inputWrapper: 'bg-slate-800 border-slate-600 hover:border-slate-500',
                  }}
                  required
                />

                <Textarea
                  label="Description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe your project, technologies used, and key features..."
                  classNames={{
                    input: 'bg-slate-800 text-white',
                    inputWrapper: 'bg-slate-800 border-slate-600 hover:border-slate-500',
                  }}
                  minRows={3}
                  required
                />

                <Input
                  label="Project Link"
                  value={projectLink}
                  onChange={e => setProjectLink(e.target.value)}
                  placeholder="https://github.com/username/project"
                  classNames={{
                    input: 'bg-slate-800 text-white',
                    inputWrapper: 'bg-slate-800 border-slate-600 hover:border-slate-500',
                  }}
                  startContent={<ExternalLink className="w-4 h-4 text-slate-400" />}
                  required
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Project Image (Optional)
                  </label>
                  <FileInput
                    onChange={handleFileChange}
                    accept="image/png,image/jpeg"
                    maxSize={2 * 1024 * 1024}
                    fileList={fileList}
                    setFileList={setFileList}
                    listType="full-width"
                  />
                </div>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={handleCancel} className="text-slate-400">
                Cancel
              </Button>
              <Button
                onPress={() => {
                  const form = document.querySelector('form') as HTMLFormElement;
                  if (form) {
                    form.requestSubmit();
                  }
                }}
                isLoading={createLoading || updateLoading}
                className="bg-slate-700 hover:bg-slate-600 text-white"
                startContent={
                  !createLoading &&
                  !updateLoading &&
                  (editingProject ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />)
                }
              >
                {createLoading || updateLoading
                  ? editingProject
                    ? 'Updating...'
                    : 'Creating...'
                  : editingProject
                    ? 'Update Project'
                    : 'Create Project'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          size="sm"
          classNames={{
            backdrop: 'bg-black/50 backdrop-blur-sm',
            base: 'border border-red-500/20 bg-slate-900',
            header: 'border-b border-red-500/20',
            footer: 'border-t border-red-500/20',
          }}
        >
          <ModalContent>
            <ModalHeader className="text-red-400">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Delete Project
              </div>
            </ModalHeader>
            <ModalBody>
              <p className="text-slate-300">
                Are you sure you want to delete this project? This action cannot be undone.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onPress={() => setDeleteModalOpen(false)}
                className="text-slate-400"
              >
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={confirmDelete}
                isLoading={deleteLoading}
                startContent={!deleteLoading && <Trash2 className="w-4 h-4" />}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </PageContainer>
  );
};

export default Projects;
