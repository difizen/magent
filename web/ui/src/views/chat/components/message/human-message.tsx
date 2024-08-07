import { LoadingOutlined } from '@ant-design/icons';
import { useInject, useObserve, ViewInstance } from '@difizen/mana-app';
import { Avatar, Space } from 'antd';
import classNames from 'classnames';
import type { ReactNode } from 'react';

import type { HumanChatMessageItem } from '../../../../modules/chat-message/chat-message-item.js';
import type { ChatMessageModel } from '../../../../modules/chat-message/chat-message-model.js';
import type { ChatView } from '../../view.js';

import { TextMessage } from './text/index.js';
import './index.less';

interface HumanMessageProps {
  message: HumanChatMessageItem;
  exchange: ChatMessageModel;
}
export const HumanMessageAddon = (props: HumanMessageProps) => {
  const exchange = useObserve(props.exchange);
  if (!exchange.startTime) {
    return null;
  }
  return (
    <div className={`chat-message-addon`}>
      <span>开始时间: {exchange.startTime?.format('YYYY-MM-DD HH:mm:ss')}</span>
    </div>
  );
};
export const HumanMessage = (props: HumanMessageProps) => {
  const exchange = useObserve(props.exchange);
  const message = useObserve(props.message);
  const instance = useInject<ChatView>(ViewInstance);
  const session = instance.session;
  if (!session) {
    return null;
  }

  const avatarSrc = 'https://api.dicebear.com/7.x/miniavs/svg?seed=1';
  const nickName = '';

  const content: ReactNode = (
    <>
      {exchange.sending && <LoadingOutlined className="chat-message-human-sending" />}
      <Space />
      {message.content || ''}
    </>
  );

  return (
    <div className={classNames('chat-message-main')}>
      <Avatar className="chat-message-avatar" src={avatarSrc} />
      <div className="chat-message-human">
        <TextMessage content={content} />
        <HumanMessageAddon {...props} />
      </div>
    </div>
  );
};
