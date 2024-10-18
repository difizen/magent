import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import type { GetProp, UploadProps } from 'antd';
import { message, Upload } from 'antd';
import type { FC } from 'react';
import { useState } from 'react';
import './index.less';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('仅支持 JPG/PNG 文件!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('文件最大 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

interface AvatarUploadProps extends Omit<UploadProps, 'onChange'> {
  AvatarRender: FC<{ imageUrl?: string }>;
  value?: string;
  onChange?: (value: string) => void;
}

export const AvatarUpload = (props: AvatarUploadProps) => {
  const { AvatarRender, value } = props;
  const [imageUrl, setImageUrl] = useState<string>();
  const [uploading, setUploading] = useState(false);

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setUploading(true);
      return;
    }
    if (info.file.status === 'done') {
      const filename = info.file.response?.filename;
      const value = `resources/${filename}`;
      setImageUrl(value);
      setUploading(false);
      props.onChange?.(value);
    }
  };

  const avatarValue = value || imageUrl;

  return (
    <Upload
      {...props}
      name="file"
      listType="picture-card"
      className="magent-avatar-uploader"
      showUploadList={false}
      action="/api/v1/resource/uploadfile"
      method="post"
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      <div className="magent-avatar-uploader-content">
        {uploading ? (
          <LoadingOutlined />
        ) : (
          <>
            <AvatarRender imageUrl={avatarValue} />
            <div className="magent-avatar-uploader-content-mask">
              <UploadOutlined />
            </div>
          </>
        )}
      </div>
    </Upload>
  );
};
