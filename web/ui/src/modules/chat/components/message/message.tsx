import { LoadingOutlined } from '@ant-design/icons';
import { useInject, useObserve } from '@difizen/mana-app';
import { Avatar } from 'antd';
import classNames from 'classnames';
import type { ReactNode } from 'react';
import { useState } from 'react';

import type { Chat, ChatMessage } from '../../protocol.js';
import { ChatInstance, MessageSenderType } from '../../protocol.js';
import Typing from '../typing/index.js';

import './index.less';

interface MessageProps {
  message: ChatMessage;
}
export const Message = (props: MessageProps) => {
  const message = useObserve(props.message);
  const chat = useInject<Chat>(ChatInstance);

  const [contentHover, setContentHover] = useState<boolean>(false);
  let avatarSrc = 'https://api.dicebear.com/7.x/miniavs/svg?seed=1';
  let nickName = 'user';
  if (message.senderType === MessageSenderType.AI && chat.bot?.avatar) {
    avatarSrc = chat.bot?.avatar;
    nickName = chat.bot?.name;
  }
  if (message.senderType === MessageSenderType.HUMAN) {
    avatarSrc = '';
    nickName = '';
  }

  let content: ReactNode = message.content;
  if (!message.complete) {
    content = (
      <>
        {message.content}
        <Typing />
      </>
    );
  }
  if (!content) {
    content = <LoadingOutlined />;
  }

  return (
    <div className="chat-message">
      <div className="chat-message-box">
        <div className="chat-message-avatar">
          <Avatar src={avatarSrc} />
        </div>
        <div className="chat-message-container">
          <div className="chat-message-container-header">
            <div className="chat-message-container-header-nickname">{nickName}</div>
            {contentHover && message.createdAt && (
              <span className="chat-message-container-header-created-time">
                {message.createdAt?.format('MM-DD HH:mm:ss')}
              </span>
            )}
          </div>
          <div
            className="chat-message-content"
            onMouseEnter={() => setContentHover(true)}
            onMouseLeave={() => setContentHover(false)}
          >
            <div
              className={classNames('chat-message-content-inner', {
                'chat-message-content-bot': message.senderType === MessageSenderType.AI,
                'chat-message-content-user':
                  message.senderType === MessageSenderType.HUMAN,
              })}
            >
              {content}
            </div>
          </div>
          <div className="chat-message-footer"></div>
        </div>
      </div>
    </div>
  );
};
