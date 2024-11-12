import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { Image, Upload, message } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import BackendApi from '../../Constant/Api';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface FileInputProps {
  onChange?: (imageUrl: string | null) => void;
  accept?: string;
  maxSize?: number;
  fileList?: UploadFile[];
  setFileList?: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  listType?: 'picture-card' | 'picture-circle';
}

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

const FileInput: React.FC<FileInputProps> = ({
  onChange,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  fileList = [],
  setFileList = () => {},
  listType = 'picture-card',
}) => {
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;

    setLoading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post<{ imageUrl: string; publicId: string }>(
        `${BackendApi}/cloudinary/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      if (response.status === 200) {
        const newFile: UploadFile = {
          uid: file.uid,
          name: file.name,
          status: 'done',
          url: response.data.imageUrl,
          response: { publicId: response.data.publicId },
        };
        setFileList([newFile]);
        onChange?.(response.data.imageUrl);
        onSuccess(response, file);
      } else {
        throw new Error(`Upload failed with status ${response.status}`);
      }
    } catch (error) {
      message.error('Failed to upload image');
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (file: UploadFile) => {
    try {
      const publicId = file.response?.publicId;
      if (!publicId) {
        throw new Error('Public ID is missing');
      }

      const response = await axios.post(
        `${BackendApi}/cloudinary/delete`,
        { publicId },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.status === 200) {
        message.success('Image deleted successfully');
        setFileList(prevList => prevList.filter(item => item.uid !== file.uid));
        onChange?.(null);
      } else {
        throw new Error(`Delete failed with status ${response.status}`);
      }
    } catch (error) {
      message.error('Failed to delete image');
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
      <Upload
        listType={listType}
        fileList={fileList}
        onPreview={handlePreview}
        beforeUpload={beforeUpload}
        onRemove={handleDelete}
        accept={accept}
        customRequest={handleUpload}
        showUploadList={{ showRemoveIcon: !loading }}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          preview={{
            visible: previewOpen,
            onVisibleChange: visible => setPreviewOpen(visible),
            src: previewImage,
          }}
        />
      )}
    </>
  );
};

export default FileInput;
