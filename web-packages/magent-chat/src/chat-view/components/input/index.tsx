/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { PlusCircleOutlined } from '@ant-design/icons';
import { useInject, ViewInstance } from '@difizen/mana-app';
import { l10n } from '@difizen/mana-l10n';
import { Button, Input as AntdInput, Popover } from 'antd';
import type { TextAreaRef } from 'antd/es/input/TextArea.js';
import classnames from 'classnames';
import type { ChangeEvent, ReactNode, KeyboardEvent, FC } from 'react';
import { useRef } from 'react';
import { forwardRef, useCallback, useMemo, useState } from 'react';

import type { ChatView } from '../../view.js';

import { SendIcon } from './icon.js';

import './index.less';
import { UploadingFilePreview } from './uploading-file-preview.js';

function insertAtCaret(e: ChangeEvent<HTMLTextAreaElement>, valueToInsert?: string) {
  const target = e.target;

  const start = target.selectionStart;
  const end = target.selectionEnd;
  const newValue =
    target.value.slice(0, start) + valueToInsert + target.value.slice(end);

  e.target.value = newValue;
  e.target.selectionStart = start + 1;
  e.target.selectionEnd = end + 1;

  const lineHeight = parseInt(getComputedStyle(target).lineHeight);
  const linesCount = newValue.substring(0, start + 1).split('\n').length;
  const newLineTop = linesCount * lineHeight;
  const visibleBottom = target.scrollTop + target.clientHeight;

  if (newLineTop > visibleBottom) {
    e.target.scrollTop = newLineTop - target.clientHeight;
  }

  return e;
}

export interface InputProps {
  prefixCls?: string;
  /** 提示信息 */
  tips?: ReactNode;
  /**
   * tips 位置
   * @default top
   */
  tipsPosition?: 'top' | 'bottom';
  /** 最外层容器 className */
  wrapperClassName?: string;
  /**
   * enter时，是否直接发送消息, 若配置为true，换行时请使用 Command 键（⌘）+ enter 或者 Windows 键（⊞）+ enter。
   * @default false
   */
  isEnterSend?: boolean;
  /**
   * isEnterSend 为 true 时，用于直接提交
   */
  onSubmit?: (value: string, image?: string) => void;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  sendEnable?: boolean;
  sending?: boolean;
  value?: string;
}

/** @deprecated 仅用于 API 文档说明 */
export const DOCS_API_INPUT_PROPS: FC<InputProps> = () => null;

export const Input = forwardRef<TextAreaRef, InputProps>(function Input(
  props: InputProps,
  ref,
) {
  const instance = useInject<ChatView>(ViewInstance);
  const [v, setV] = useState<string>('');
  const {
    prefixCls = 'chat-input',
    tips,
    wrapperClassName = '',
    sendEnable = true,
    isEnterSend = true,
    onChange,
    onKeyDown,
    value = v,
  } = props;

  // const videoInputRef = useRef(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<{ key: string; url: string }[] | undefined>();
  const [videos, setVideos] = useState<
    { key: string; url: string; thumb: string }[] | undefined
  >();

  const imageUrlsRef = useRef<{ key: string; url: string }[] | undefined>(undefined); // 模型可以直接使用的图片地址
  const videoUrlsRef = useRef<
    { key: string; url: string; thumb: string }[] | undefined
  >(undefined);

  const clearAllUploadingFilesState = () => {
    setImages(undefined);
    setVideos(undefined);
  };

  const clearAllUploadingFilesRef = () => {
    imageUrlsRef.current = undefined;
    videoUrlsRef.current = undefined;
  };

  const handleDeleteUploadImage = (key: string) => {
    setImages((prev) => {
      if (!prev) {
        return prev;
      }
      return prev.filter((item) => item.key !== key);
    });
    imageUrlsRef.current = imageUrlsRef.current?.filter((item) => item.key !== key);
    if (imageUrlsRef.current?.length === 0) {
      // 重置输入框的值
      imageInputRef.current!.value = '';
    }
  };

  const handleDeleteUploadVideo = (key: string) => {
    setVideos((prev) => {
      if (!prev) {
        return prev;
      }
      return prev.filter((item) => item.key !== key);
    });
    videoUrlsRef.current = videoUrlsRef.current?.filter((item) => item.key !== key);
    // if (videoUrlsRef.current?.length === 0) {
    //   // 重置输入框的值
    //   videoInputRef.current!.value = null;
    // }
  };

  const updateUploadingFiles = (params: {
    images: { key: string; url: string }[] | undefined;
    videos: { key: string; url: string; thumb: string }[] | undefined;
  }) => {
    clearAllUploadingFilesState();
    clearAllUploadingFilesRef();

    if (params.images && params.images.length > 0) {
      setImages(params.images);
      imageUrlsRef.current = params.images;
      return;
    }

    if (params.videos && params.videos.length > 0) {
      setVideos(params.videos);
      videoUrlsRef.current = params.videos;
      return;
    }
  };

  // fix tips: '/' =>> ''
  const open = useMemo(() => {
    if (value === '') {
      return false;
    }

    return !!tips;
  }, [tips, value]);

  const onSubmit = useCallback(
    (v: string, i?: string) => {
      if (!v) {
        return;
      }
      props.onSubmit?.(v, i);
      setV('');
      if (instance.allowUploadingImage) {
        clearAllUploadingFilesRef();
        clearAllUploadingFilesState();
        imageInputRef.current!.value = '';
        // videoInputRef.current!.value = null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props],
  );

  function onInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setV(e.target.value);
    onChange?.(e);
  }

  function onInputKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    e.persist();
    const { metaKey, ctrlKey, altKey, shiftKey, keyCode } = e;

    if (keyCode === 13) {
      if (open) {
        e.preventDefault();
      } else if (isEnterSend && (metaKey || ctrlKey || altKey || shiftKey)) {
        const event = insertAtCaret(
          e as unknown as ChangeEvent<HTMLTextAreaElement>,
          '\n',
        );
        setTimeout(() => onInputChange(event), 0);
        e.preventDefault();
      } else if (isEnterSend) {
        e.preventDefault();
        if (sendEnable) {
          setTimeout(() => {
            const target = e.currentTarget || e.target;
            onSubmit(
              target.value,
              imageUrlsRef.current ? imageUrlsRef.current[0].url : undefined,
            );
          }, 0);
        }
      }
    }
    onKeyDown?.(e);
  }

  return (
    <div className={classnames(prefixCls, wrapperClassName)}>
      <Popover
        overlayClassName={`${prefixCls}-preview-popover`}
        arrow={false}
        content={
          (images && images.length > 0) || (videos && videos.length > 0) ? (
            <UploadingFilePreview
              images={images}
              videos={videos}
              handleDeleteUploadImage={handleDeleteUploadImage}
              handleDeleteUploadVideo={handleDeleteUploadVideo}
            />
          ) : (
            ''
          )
        }
        open={(images && images.length > 0) || (videos && videos.length > 0)}
        trigger="click"
        placement="topLeft"
      >
        <div className={`${prefixCls}-searchInput`}>
          <div className={`${prefixCls}-textArea-container`}>
            <div className={`${prefixCls}-input`}>
              <AntdInput.TextArea
                ref={ref}
                value={value}
                placeholder={l10n.t('输入聊天内容')}
                variant="borderless"
                autoSize={{ minRows: 1 }}
                style={{ resize: 'none', padding: '0px 16px', maxHeight: 80 }}
                onChange={onInputChange}
                onKeyDown={onInputKeyDown}
                className={`${prefixCls}-textArea`}
              />
            </div>
          </div>
          <div className={`${prefixCls}-input-operation`}>
            {instance.allowUploadingImage && (
              <div className={`${prefixCls}-upload`}>
                <Button className={`${prefixCls}-upload-button`}>
                  <label>
                    <input
                      type="file"
                      multiple={false}
                      accept="image/*"
                      onChange={async (e) => {
                        if (instance.handleUploadImage) {
                          await instance.handleUploadImage(e, updateUploadingFiles);
                        }
                      }}
                      ref={imageInputRef}
                      hidden
                    />
                    <PlusCircleOutlined
                      style={{ fontSize: '20px', cursor: 'pointer' }}
                    />
                  </label>
                </Button>
              </div>
            )}
            <div
              className={classnames(`${prefixCls}-sendButton`, {
                [`${prefixCls}-sendButton-disabled`]: !v || !instance.sendable,
              })}
              onClick={() => {
                if (instance.sendable) {
                  onSubmit(
                    value || v,
                    imageUrlsRef.current ? imageUrlsRef.current[0].url : undefined,
                  );
                }
              }}
            >
              <SendIcon />
            </div>
          </div>
        </div>
      </Popover>
    </div>
  );
});
