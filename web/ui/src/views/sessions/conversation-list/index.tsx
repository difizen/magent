import { CaretRightOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useInject, ViewInstance } from '@difizen/mana-app';
import { Input, Popconfirm } from 'antd';
import type { TextAreaRef } from 'antd/es/input/TextArea.js';
import classNames from 'classnames';
import { useLayoutEffect, useRef, useState } from 'react';

import type { SessionModel } from '../../../modules/session/index.js';
import type { SessionsView } from '../view.js';
import './index.less';

const { TextArea } = Input;

interface ConversationItemProps {
  session: SessionModel;
}

export const ConversationItem = ({ session }: ConversationItemProps) => {
  const [editing, setEditing] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const sessionsInstance = useInject<SessionsView>(ViewInstance);

  const ref = useRef<TextAreaRef>(null);

  const changeTitle = () => {
    const newTitle = ref.current?.resizableTextArea?.textArea.value.trim();
    if (newTitle) {
      // convUpdateTitle(conversation, newTitle);
      // TODO: change title
    }
    setEditing(false);
  };

  useLayoutEffect(() => {
    if (editing) {
      ref.current?.resizableTextArea?.textArea.focus();
      ref.current?.resizableTextArea?.textArea.setSelectionRange(30, 30);
    }
  }, [editing]);

  const isActive = session.id === sessionsInstance.active?.id;

  return (
    <div
      className={classNames(
        'chat-history-item',
        isActive && 'chat-history-item-active',
        deleteConfirmOpen && 'chat-history-item-show-action',
      )}
      onMouseEnter={() => {
        setIsMouseOver(true);
      }}
      onMouseLeave={() => {
        setIsMouseOver(false);
      }}
      onClick={() => {
        sessionsInstance.selectSession(session);
      }}
    >
      {editing ? (
        <TextArea
          ref={ref}
          defaultValue={session.id}
          onBlur={changeTitle}
          maxLength={30}
          onPressEnter={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            e.preventDefault();
            if (e.keyCode !== 229) {
              if (ref.current?.resizableTextArea?.textArea.value) {
                changeTitle();
              }
              // 229 为中文输入法下按enter，不应触发
            }
          }}
          autoSize={{ maxRows: 5 }}
        />
      ) : (
        <>
          <div className={'chat-history-item-title'} title={session.id}>
            {isActive && session.id && <CaretRightOutlined />}
            {session.previewTitle}
          </div>

          {isMouseOver ? (
            // <EditOutlined
            //   className={'chat-history-item-i'}
            //   onClick={(e) => {
            //     e.stopPropagation();
            //     setEditing(true);
            //   }}
            // />
            <></>
          ) : (
            <div className={'chat-history-item-time'}>
              {session.gmtCreate.format('HH:mm:ss')}
            </div>
          )}

          {isMouseOver && (
            <Popconfirm
              placement="topRight"
              title={'你确定删除该会话吗？'}
              onConfirm={(e?: React.MouseEvent<HTMLElement>) => {
                e?.stopPropagation();
                sessionsInstance.deleteSession(session);
              }}
              onOpenChange={(open: boolean) => {
                setDeleteConfirmOpen(open);
              }}
              onCancel={(e?: React.MouseEvent<HTMLElement>) => {
                e?.stopPropagation();
              }}
            >
              <DeleteOutlined
                className={'chat-history-item-i'}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
            </Popconfirm>
          )}
        </>
      )}
    </div>
  );
};
