import React, { useState } from 'react';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { Image, Upload, message } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import ImgCrop from 'antd-img-crop';
import axios from 'axios';
import BackendApi from '../../Constant/Api';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface FileInputProps {
    onChange?: (imageUrl: string | null) => void; 
    accept?: string;
    maxSize?: number;
}

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const FileInput: React.FC<FileInputProps> = ({
    onChange,
    accept = 'image/*',
    maxSize = 5 * 1024 * 1024, // 5MB default
}) => {
    const [loading, setLoading] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
        setFileList(newFileList);

        if (loading) return; // Prevent multiple uploads

        if (newFileList[0]?.originFileObj) {
            setLoading(true);

            const formData = new FormData();
            formData.append('image', newFileList[0].originFileObj);

            try {
                const response = await axios.post<{ imageUrl: string }>(
                    `${BackendApi}/cloudinary/upload`,
                    formData,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    }
                );

                if (response.status === 200) {
                    const updatedFileList: UploadFile[] = newFileList.map((file) => ({
                        ...file,
                        url: response.data.imageUrl,
                        status: 'done',
                    }));

                    setFileList(updatedFileList);
                    onChange?.(response.data.imageUrl);
                } else {
                    throw new Error(`Upload failed with status ${response.status}`);
                }
            } catch (error) {
                message.error('Failed to upload image');
                console.error('Failed to upload image:', error);

                const updatedFileList: UploadFile[] = newFileList.map((file) => ({
                    ...file,
                    status: 'error',
                    error: {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        status: (error as any).response?.status || 500,
                        method: 'post',
                        url: '',
                    },
                }));

                setFileList(updatedFileList);
                onChange?.(null);
            } finally {
                setLoading(false);
            }
        }
    };

    const beforeUpload = (file: FileType) => {
        const acceptedTypes = accept.split(',');
        const isAccepted = acceptedTypes.includes(file.type); 

        if (!isAccepted) {
            message.error(`You can only upload ${accept} files!`);
            return Upload.LIST_IGNORE;
        }

        const isLessThanMaxSize = file.size < maxSize;
        if (!isLessThanMaxSize) {
            message.error(`File must be smaller than ${maxSize / (1024 * 1024)}MB!`);
            return Upload.LIST_IGNORE;
        }

        return true;
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    return (
        <>
            <ImgCrop rotationSlider>
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    beforeUpload={beforeUpload}
                    accept={accept}
                >
                    {fileList.length >= 1 ? null : uploadButton}
                </Upload>
            </ImgCrop>
            {previewImage && (
                <Image
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        src: previewImage,
                    }}
                />
            )}
        </>
    );
};

export default FileInput;
