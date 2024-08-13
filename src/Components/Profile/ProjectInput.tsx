import React, { useState } from 'react';
import { Input, Textarea, Button, Card, Spacer } from "@nextui-org/react";
import FileInput from '../Global/FileInput';
import { useMutation } from '@apollo/client';
import ADD_PROJECT_MUTATION from '../../GraphQL/Mutations/Projects';

const ProjectInput: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [projectLink, setProjectLink] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [addProject, { loading, error }] = useMutation(ADD_PROJECT_MUTATION, {
        onCompleted: () => {
            setTitle('');
            setDescription('');
            setImageUrl(null);
            setProjectLink('');
        },
    });
    const handleFileChange = (imageUrl: string | null) => {
        setImageUrl(imageUrl);
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await addProject({ variables: { title, description, imageUrl, projectLink } });
        } catch (err) {
            console.error('Error adding project:', err);
        }
    };

    return (
        <div className="mx-auto ml-[12rem] max-w-lg">
            <Card className="p-6 mb-6 shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Add New Project</h2>
            </Card>
            <Card className="p-6 shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Project Title"
                        placeholder="Enter project title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        fullWidth
                        color="primary"
                        size="lg"
                        className="dark:bg-gray-700 dark:text-gray-100"
                    />
                    <Spacer y={1} />
                    <Textarea
                        label="Project Description"
                        placeholder="Enter project description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        fullWidth
                        color="primary"
                        size="lg"
                        minRows={3}
                        className="dark:bg-gray-700 dark:text-gray-100"
                    />
                    <Spacer y={1} />
                    <FileInput
                        onChange={handleFileChange}
                        accept="image/png,image/jpeg"
                        maxSize={2 * 1024 * 1024} // 2MB max size
                    />
                    <Spacer y={1} />
                    <Input
                        label="Project Link"
                        placeholder="Enter project link"
                        value={projectLink}
                        onChange={(e) => setProjectLink(e.target.value)}
                        fullWidth
                        color="primary"
                        size="lg"
                        className="dark:bg-gray-700 dark:text-gray-100"
                    />
                    <Spacer y={1.5} />
                    <Button
                        type="submit"
                        color="primary"
                        disabled={loading}
                        className="w-full bg-blue-500 dark:bg-blue-700 text-white"
                    >
                        {loading ? 'Submitting...' : 'Submit Project'}
                    </Button>
                    {error && <p className="text-red-500 mt-2">Error submitting project. Please try again.</p>}
                </form>
            </Card>
        </div>
    );
};

export default ProjectInput;
