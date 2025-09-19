import { LoadingOutlined, PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { message } from 'antd';
import React, { useState, useRef } from 'react';
import BackendApi from '../../Constant/Api';

export interface UploadFile {
  uid: string;
  name: string;
  status: 'uploading' | 'done' | 'error';
  url?: string;
  preview?: string;
  response?: { publicId: string };
  originFileObj?: File;
}

interface FileInputProps {
  onChange?: (imageUrl: string | null) => void;
  accept?: string;
  maxSize?: number;
  fileList?: UploadFile[];
  setFileList?: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  listType?: 'picture-card' | 'picture-circle' | 'full-width' | 'list';
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

const FileInput: React.FC<FileInputProps> = ({
  onChange,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024,
  fileList = [],
  setFileList = () => {},
  listType = 'picture-card',
  multiple = false,
  disabled = false,
  className = '',
}) => {
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleUpload = async (file: File) => {
    const uid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Add file to list with uploading status
    const uploadingFile: UploadFile = {
      uid,
      name: file.name,
      status: 'uploading',
      originFileObj: file,
    };

    if (multiple) {
      setFileList(prev => [...prev, uploadingFile]);
    } else {
      setFileList([uploadingFile]);
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${BackendApi}/cloudinary/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data: { imageUrl: string; publicId: string } = await response.json();
        const successFile: UploadFile = {
          uid,
          name: file.name,
          status: 'done',
          url: data.imageUrl,
          response: { publicId: data.publicId },
        };

        setFileList(prev => prev.map(f => (f.uid === uid ? successFile : f)));
        onChange?.(data.imageUrl);
      } else {
        throw new Error(`Upload failed with status ${response.status}`);
      }
    } catch (error) {
      message.error('Failed to upload image');

      // Update file status to error
      setFileList(prev => prev.map(f => (f.uid === uid ? { ...f, status: 'error' as const } : f)));
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

      const response = await fetch(`${BackendApi}/cloudinary/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId }),
      });

      if (response.ok) {
        message.success('Image deleted successfully');
        setFileList(prev => prev.filter(item => item.uid !== file.uid));
        onChange?.(null);
      } else {
        throw new Error(`Delete failed with status ${response.status}`);
      }
    } catch (error) {
      message.error('Failed to delete image');
    }
  };

  const beforeUpload = (file: File) => {
    const acceptedTypes = accept.split(',').map(type => type.trim());
    const isAccepted = acceptedTypes.some(type => {
      if (type === 'image/*') return file.type.startsWith('image/');
      if (type.endsWith('/*')) return file.type.startsWith(type.slice(0, -1));
      return file.type === type;
    });

    if (!isAccepted) {
      message.error(`You can only upload ${accept} files!`);
      return false;
    }

    const isLessThanMaxSize = file.size < maxSize;
    if (!isLessThanMaxSize) {
      message.error(`File must be smaller than ${maxSize / (1024 * 1024)}MB!`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    files.forEach(file => {
      if (beforeUpload(file)) {
        handleUpload(file);
      }
    });

    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const renderUploadButton = () => {
    const buttonStyle: React.CSSProperties = {
      border: '2px dashed #d9d9d9',
      borderRadius: '8px',
      background: 'transparent',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#666',
      fontSize: '14px',
    };

    if (listType === 'picture-card') {
      return (
        <div
          style={{
            ...buttonStyle,
            width: '104px',
            height: '104px',
            opacity: disabled ? 0.5 : 1,
          }}
          onClick={triggerFileSelect}
          onMouseEnter={e => {
            if (!disabled) {
              e.currentTarget.style.borderColor = '#1890ff';
              e.currentTarget.style.color = '#1890ff';
            }
          }}
          onMouseLeave={e => {
            if (!disabled) {
              e.currentTarget.style.borderColor = '#d9d9d9';
              e.currentTarget.style.color = '#666';
            }
          }}
        >
          {loading ? (
            <LoadingOutlined style={{ fontSize: '24px' }} />
          ) : (
            <PlusOutlined style={{ fontSize: '24px' }} />
          )}
          <div style={{ marginTop: '8px' }}>Upload</div>
        </div>
      );
    }

    if (listType === 'picture-circle') {
      return (
        <div
          style={{
            ...buttonStyle,
            width: '104px',
            height: '104px',
            borderRadius: '50%',
            opacity: disabled ? 0.5 : 1,
          }}
          onClick={triggerFileSelect}
        >
          {loading ? (
            <LoadingOutlined style={{ fontSize: '24px' }} />
          ) : (
            <PlusOutlined style={{ fontSize: '24px' }} />
          )}
        </div>
      );
    }

    if (listType === 'full-width') {
      return (
        <div
          style={{
            ...buttonStyle,
            width: '100%',
            minHeight: '120px',
            padding: '20px',
            opacity: disabled ? 0.5 : 1,
          }}
          onClick={triggerFileSelect}
        >
          {loading ? (
            <LoadingOutlined style={{ fontSize: '32px' }} />
          ) : (
            <PlusOutlined style={{ fontSize: '32px' }} />
          )}
          <div style={{ marginTop: '12px', fontSize: '16px' }}>
            Click or drag files here to upload
          </div>
          <div style={{ marginTop: '4px', fontSize: '12px', color: '#999' }}>
            Support {accept} files up to {(maxSize / (1024 * 1024)).toFixed(0)}MB
          </div>
        </div>
      );
    }

    // list type
    return (
      <button
        style={{
          ...buttonStyle,
          padding: '8px 16px',
          minHeight: '32px',
          opacity: disabled ? 0.5 : 1,
        }}
        onClick={triggerFileSelect}
        disabled={disabled}
      >
        {loading ? (
          <LoadingOutlined style={{ marginRight: '8px' }} />
        ) : (
          <PlusOutlined style={{ marginRight: '8px' }} />
        )}
        Select Files
      </button>
    );
  };

  const renderFileItem = (file: UploadFile) => {
    const isImage =
      file.url || (file.originFileObj && file.originFileObj.type.startsWith('image/'));

    if (listType === 'picture-card' || listType === 'picture-circle') {
      return (
        <div
          key={file.uid}
          style={{
            position: 'relative',
            display: 'inline-block',
            marginRight: '8px',
            marginBottom: '8px',
          }}
        >
          <div
            style={{
              width: '104px',
              height: '104px',
              border: '1px solid #d9d9d9',
              borderRadius: listType === 'picture-circle' ? '50%' : '8px',
              overflow: 'hidden',
              background: '#fafafa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {isImage ? (
              <img
                src={file.url || file.preview}
                alt={file.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '8px' }}>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>📄</div>
                <div style={{ fontSize: '10px', wordBreak: 'break-all' }}>{file.name}</div>
              </div>
            )}

            {file.status === 'uploading' && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(255, 255, 255, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: listType === 'picture-circle' ? '50%' : '8px',
                }}
              >
                <LoadingOutlined style={{ fontSize: '24px' }} />
              </div>
            )}
          </div>

          {file.status === 'done' && (
            <div
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                background: 'rgba(0, 0, 0, 0.6)',
                borderRadius: '4px',
                display: 'flex',
                gap: '4px',
                padding: '4px',
              }}
            >
              {isImage && (
                <EyeOutlined
                  style={{ color: 'white', cursor: 'pointer', fontSize: '14px' }}
                  onClick={() => handlePreview(file)}
                />
              )}
              <DeleteOutlined
                style={{ color: 'white', cursor: 'pointer', fontSize: '14px' }}
                onClick={() => handleDelete(file)}
              />
            </div>
          )}
        </div>
      );
    }

    if (listType === 'full-width') {
      return (
        <div
          key={file.uid}
          style={{
            width: '100%',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            background: '#fafafa',
          }}
        >
          {isImage ? (
            <img
              src={file.url || file.preview}
              alt={file.name}
              style={{
                width: '48px',
                height: '48px',
                objectFit: 'cover',
                borderRadius: '4px',
                marginRight: '12px',
              }}
            />
          ) : (
            <div
              style={{
                width: '48px',
                height: '48px',
                background: '#e6f7ff',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px',
                fontSize: '20px',
              }}
            >
              📄
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 500, marginBottom: '4px', wordBreak: 'break-all' }}>
              {file.name}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {file.status === 'uploading' && 'Uploading...'}
              {file.status === 'done' && 'Upload complete'}
              {file.status === 'error' && 'Upload failed'}
            </div>
          </div>

          {file.status === 'uploading' && (
            <LoadingOutlined style={{ fontSize: '16px', marginLeft: '8px' }} />
          )}

          {file.status === 'done' && (
            <div style={{ display: 'flex', gap: '8px', marginLeft: '8px' }}>
              {isImage && (
                <EyeOutlined
                  style={{ cursor: 'pointer', fontSize: '16px', color: '#1890ff' }}
                  onClick={() => handlePreview(file)}
                />
              )}
              <DeleteOutlined
                style={{ cursor: 'pointer', fontSize: '16px', color: '#ff4d4f' }}
                onClick={() => handleDelete(file)}
              />
            </div>
          )}
        </div>
      );
    }

    // list type
    return (
      <div
        key={file.uid}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 12px',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          marginBottom: '8px',
          background: '#fafafa',
        }}
      >
        <span style={{ flex: 1, marginRight: '8px', wordBreak: 'break-all' }}>{file.name}</span>

        {file.status === 'uploading' && <LoadingOutlined style={{ marginRight: '8px' }} />}

        {file.status === 'done' && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {isImage && (
              <EyeOutlined
                style={{ cursor: 'pointer', color: '#1890ff' }}
                onClick={() => handlePreview(file)}
              />
            )}
            <DeleteOutlined
              style={{ cursor: 'pointer', color: '#ff4d4f' }}
              onClick={() => handleDelete(file)}
            />
          </div>
        )}
      </div>
    );
  };

  const shouldShowUploadButton = multiple || fileList.length === 0;

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        disabled={disabled}
      />

      <div
        style={{
          display: listType === 'picture-card' || listType === 'picture-circle' ? 'flex' : 'block',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}
      >
        {fileList.map(renderFileItem)}
        {shouldShowUploadButton && renderUploadButton()}
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setPreviewOpen(false)}
        >
          <div style={{ maxWidth: '90vw', maxHeight: '90vh', position: 'relative' }}>
            <img
              src={previewImage}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
            <button
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(0, 0, 0, 0.6)',
                border: 'none',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
              onClick={() => setPreviewOpen(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileInput;
