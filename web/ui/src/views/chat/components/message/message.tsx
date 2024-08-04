import { LoadingOutlined } from '@ant-design/icons';
import { useInject, useObserve, ViewInstance } from '@difizen/mana-app';
import { Avatar } from 'antd';
import classNames from 'classnames';
import type { ReactNode } from 'react';
import { useState } from 'react';

import type {
  ChatMessageModel,
  MessageItem,
  MessageSender,
} from '../../../../modules/chat-message/protocol.js';
import type { ChatView } from '../../view.js';
import Typing from '../typing/index.js';

import './index.less';

interface MessageProps {
  exchange: ChatMessageModel;
  message: MessageItem;
  type: MessageSender;
}
export const Message = (props: MessageProps) => {
  const exchange = useObserve(props.exchange);
  const message = useObserve(props.message);
  const instance = useInject<ChatView>(ViewInstance);
  const session = instance.session;
  const agent = instance.agent;
  const [contentHover, setContentHover] = useState<boolean>(false);
  if (!session) {
    return null;
  }

  let avatarSrc = 'https://api.dicebear.com/7.x/miniavs/svg?seed=1';
  let nickName = 'user';
  if (message.senderType === 'AI' && agent?.avatar) {
    avatarSrc = agent?.avatar;
    nickName = agent?.name || '';
  }
  if (message.senderType === 'HUMAN') {
    avatarSrc = '';
    nickName = '';
  }

  let content: ReactNode = message.content;
  if (!exchange.sending) {
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
            {contentHover && exchange.created && (
              <span className="chat-message-container-header-created-time">
                {exchange.created?.toString()}
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
                'chat-message-content-bot': message.senderType === 'AI',
                'chat-message-content-user': message.senderType === 'HUMAN',
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
