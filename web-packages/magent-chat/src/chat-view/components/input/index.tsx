import { useInject, ViewInstance } from '@difizen/mana-app';
import { Input as AntdInput, Tooltip } from 'antd';
import type { TextAreaRef } from 'antd/es/input/TextArea.js';
import classnames from 'classnames';
import type { ChangeEvent, ReactNode, KeyboardEvent, FC } from 'react';
import { forwardRef, useCallback, useMemo, useState } from 'react';

import type { ChatView } from '../../view.js';

import { AudioIcon, FolderIcon, ImgIcon, SendIcon, VideoIcon } from './icon.js';

import './index.less';

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
  onSubmit?: (value: string) => void;
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

  // fix tips: '/' =>> ''
  const open = useMemo(() => {
    if (value === '') {
      return false;
    }

    return !!tips;
  }, [tips, value]);

  const onSubmit = useCallback(
    (v: string) => {
      props.onSubmit?.(v);
      setV('');
    },
    [props],
  );

  function onInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setV(e.target.value);
    onChange?.(e);
  }

  function onInputKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    e.persist();
    const { metaKey, ctrlKey, altKey, keyCode } = e;

    if (keyCode === 13) {
      if (open) {
        e.preventDefault();
      } else if (isEnterSend && (metaKey || ctrlKey || altKey)) {
        const event = insertAtCaret(
          e as unknown as ChangeEvent<HTMLTextAreaElement>,
          '\n',
        );
        setTimeout(() => onInputChange(event), 0);
      } else if (isEnterSend) {
        e.preventDefault();
        if (sendEnable) {
          setTimeout(() => {
            const target = e.currentTarget || e.target;
            onSubmit(target.value);
          }, 0);
        }
      }
    }
    onKeyDown?.(e);
  }

  return (
    <div className={classnames(prefixCls, wrapperClassName)}>
      <div className={`${prefixCls}-searchInput`}>
        <div className={`${prefixCls}-textArea`}>
          <div className={`${prefixCls}-upload`}>
            <Tooltip placement="top" title={'不支持上传图片'}>
              <div>
                <ImgIcon />
              </div>
            </Tooltip>

            <Tooltip placement="top" title={'不支持上传音频'}>
              <div>
                <AudioIcon />
              </div>
            </Tooltip>

            <Tooltip placement="top" title={'不支持上传视频'}>
              <div>
                <VideoIcon />
              </div>
            </Tooltip>
            <Tooltip placement="top" title={'不支持上传文件'}>
              <div>
                <FolderIcon />
              </div>
            </Tooltip>
          </div>
          <div className={`${prefixCls}-input`}>
            <AntdInput.TextArea
              ref={ref}
              value={value}
              placeholder={'输入聊天内容'}
              variant="borderless"
              autoSize={{ minRows: 1 }}
              style={{ resize: 'none', padding: '0px 16px', maxHeight: 80 }}
              onChange={onInputChange}
              onKeyDown={onInputKeyDown}
              className={`${prefixCls}-textArea`}
            />
          </div>
        </div>
        <div className={`${prefixCls}-iconBottom`}>
          <div
            className={classnames(`${prefixCls}-sendButton`, {
              [`${prefixCls}-send-button-disabled`]: !instance.sendable,
            })}
            onClick={() => {
              if (instance.sendable) {
                onSubmit(value || v);
              }
            }}
          >
            <SendIcon />
          </div>
        </div>
      </div>
    </div>
  );
});
