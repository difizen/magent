import {
  CopyOutlined,
  DislikeOutlined,
  LikeOutlined,
  LoadingOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useInject, useObserve, ViewInstance } from '@difizen/mana-app';
import { Avatar, Space } from 'antd';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import type { ReactNode } from 'react';

import { MagentLOGO } from '../../../../modules/base-layout/brand/logo.js';
import type { ChatMessageItem } from '../../../../modules/chat-message/chat-message-item.js';
import { AIChatMessageItem } from '../../../../modules/chat-message/chat-message-item.js';
import { HumanChatMessageItem } from '../../../../modules/chat-message/chat-message-item.js';
import type { ChatMessageModel } from '../../../../modules/chat-message/chat-message-model.js';
import type { ChatView } from '../../view.js';

import { MarkdownMessage } from './markdown-message/index.js';
import { TextMessage } from './text/index.js';
import './index.less';

interface MessageProps {
  message: ChatMessageItem;
  exchange: ChatMessageModel;
}

export const HumanMessage = (props: MessageProps) => {
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
      {message.content}
    </>
  );

  return (
    <div className={classNames('chat-message-main')}>
      <Avatar src={avatarSrc} />
      <TextMessage content={content} />
    </div>
  );
};
export const AIMessage = (props: MessageProps) => {
  const message = useObserve(props.message);
  const instance = useInject<ChatView>(ViewInstance);
  const session = instance.session;
  const agent = instance.agent;
  if (!session) {
    return null;
  }

  // const [contentHover, setContentHover] = useState<boolean>(false);
  const avatarSrc: ReactNode = agent?.avatar || <MagentLOGO />;
  const nickName = agent?.name || '';

  let content: ReactNode = message.content;
  if (!content) {
    content = <LoadingOutlined />;
  } else {
    content = (
      <>
        <MarkdownMessage message={message} />
      </>
    );
  }

  const actions = [
    <span key="action-tag-3" className={`chat-message-action-tag`}>
      <LikeOutlined />
    </span>,
    <span key="action-tag-2" className={`chat-message-action-tag`}>
      <DislikeOutlined />
    </span>,
    <span
      key="action-tag-1"
      className={`chat-message-action-tag`}
      onClick={() => {
        copy(message.content);
      }}
    >
      <CopyOutlined />
    </span>,
  ];

  return (
    <div className={classNames('chat-message-main', 'chat-message-main-ai')}>
      <Avatar src={avatarSrc} />
      <div className={`chat-message-container`}>
        {content}
        <div style={{ paddingTop: 8, display: 'flex' }}>
          <div
            className={'chat-message-retry'}
            onClick={() => {
              // TODO:
            }}
          >
            <ReloadOutlined style={{ marginRight: '5px' }} />
            重新生成
          </div>
          <div className={'chat-message-actions'}>{actions.filter(Boolean)}</div>
        </div>
      </div>
    </div>
  );
};
export const Message = (props: MessageProps) => {
  const message = useObserve(props.message);
  if (message instanceof HumanChatMessageItem) {
    return <HumanMessage {...props} />;
  }
  if (message instanceof AIChatMessageItem) {
    return <AIMessage {...props} />;
  }
  return null;
};
