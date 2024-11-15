/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import React from 'react';
import './uploading-file-preview.less';

const prefixCls = 'uploading-file-preview';

export const UploadingFilePreview: React.FC<{
  images: { key: string; url: string }[] | undefined;
  videos: { key: string; url: string; thumb: string }[] | undefined;
  handleDeleteUploadImage: (key: string) => void;
  handleDeleteUploadVideo: (key: string) => void;
}> = (props) => {
  const { images, videos, handleDeleteUploadVideo, handleDeleteUploadImage } = props;

  if ((!images || images.length === 0) && (!videos || videos.length === 0)) {
    return null;
  }

  if (images && images.length > 0) {
    return (
      <div className={`${prefixCls}-imagePreview`}>
        {images.map((img) => {
          return (
            <div key={img.key} className={`${prefixCls}-recordItem`}>
              <div className={`${prefixCls}-imgWrap`}>
                <img src={img.url} />
                <div
                  className={`${prefixCls}-imgWrap-delete`}
                  onClick={(e) => {
                    handleDeleteUploadImage(img.key);
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  <CloseOutlined />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`${prefixCls}-imagePreview`}>
      {videos!.map((video) => {
        return (
          <div key={video.key} className={`${prefixCls}-recordItem`}>
            <div className={`${prefixCls}-imgWrap`}>
              <video
                src={video.url}
                preload="metadata"
                poster={video.thumb}
                loop
                muted
                autoPlay
              />
              <div
                className={`${prefixCls}-imgWrap-delete`}
                onClick={(e) => {
                  handleDeleteUploadVideo(video.key);
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <DeleteOutlined />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
