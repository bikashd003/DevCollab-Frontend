import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload, message } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import ImgCrop from 'antd-img-crop';
import axios from 'axios';
import BackendApi from '../../Constant/Api';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface FileInputProps {
    onChange?: (imageUrl: string | null) => void; // Assuming you want to return the image URL
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
        if (newFileList[0].originFileObj) {
            const formData = new FormData();
            formData.append('image', newFileList[0].originFileObj);

            try {
                const response = await axios.post(`${BackendApi}/cloudinary/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                // Return the URL of the uploaded image
                onChange?.(response.data.imageUrl);
            } catch (error) {
                message.error('Failed to upload image');
                console.error('Failed to upload image:', error);
                onChange?.(null);
            }
            setFileList(newFileList);
        }
    };

    const beforeUpload = (file: FileType) => {
        const acceptedTypes = accept.split(','); // Split the accept string into an array of types
        const isAccepted = acceptedTypes.includes(file.type); // Check if the file type is included

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
            <PlusOutlined />
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
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </>
    );
};

export default FileInput;
