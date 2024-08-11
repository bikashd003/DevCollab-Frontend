import React, { useState } from 'react';
import { Input, Textarea, Button, Card, Spacer } from "@nextui-org/react";
import FileInput from '../Global/FileInput';
const ProjectInput: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [projectLink, setProjectLink] = useState('');
    // const [file, setFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ title, description, projectLink, file });
        // Implement your submission logic here
    };

    const handleFileChange = (imageUrl: string) => {
        console.log(imageUrl)
    };

    return (
        <div className="mx-auto ml-[12rem]">
            <Card>
                <h2>Add New Project</h2>
            </Card>
            <Card>
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
                    />
                    <Spacer y={1.5} />
                    <Button type="submit" color="primary">
                        Submit Project
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default ProjectInput;
