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
import { AnswerState } from '../../../../modules/chat-message/protocol.js';
import type { ChatView } from '../../view.js';

import { Markdown } from './markdown/index.js';
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
      {message.content}
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

interface AIMessageProps {
  message: AIChatMessageItem;
  exchange: ChatMessageModel;
}

export const AIMessageAddon = (props: AIMessageProps) => {
  const exchange = useObserve(props.exchange);
  if (!exchange.tokenUsage && !exchange.responseTime) {
    return null;
  }

  return (
    <div className={`chat-message-addon`}>
      {exchange.tokenUsage && (
        <div className={`chat-message-addon-item`}>
          <span>Total token: {exchange.tokenUsage.total_tokens}</span>
          <span>Completion: {exchange.tokenUsage.completion_tokens}</span>
          <span>Prompt: {exchange.tokenUsage.prompt_tokens}</span>
        </div>
      )}
      {exchange.responseTime && (
        <div className={`chat-message-addon-item`}>
          <span>结束时间: {exchange.endTime?.format('YYYY-MM-DD HH:mm:ss')}</span>
          <span>耗时: {exchange.responseTime}</span>
        </div>
      )}
    </div>
  );
};

export const AIMessage = (props: AIMessageProps) => {
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
      <div className={`chat-message-ai`}>
        <div className={`markdown-message-md`}>
          <span className={`markdown-message-md-pop`}>
            <Markdown
              className={message.state !== AnswerState.RECEIVING ? 'tp-md' : ''}
              message={message}
              type="message"
            >
              {message.content}
            </Markdown>
          </span>
        </div>

        {message.state === AnswerState.RECEIVING && (
          <LoadingOutlined className="chat-message-ai-receiving" />
        )}
        <AIMessageAddon {...props} />
      </div>
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
      <Avatar className="chat-message-avatar" src={avatarSrc} />
      <div className={`chat-message-container`}>
        {content}
        <div style={{ paddingTop: 8, display: 'flex' }}>
          {/* <div
            className={'chat-message-retry'}
            onClick={() => {
              // TODO:
            }}
          >
            <ReloadOutlined style={{ marginRight: '5px' }} />
            重新生成
          </div> */}
          <div className={'chat-message-actions'}>{actions.filter(Boolean)}</div>
        </div>
      </div>
    </div>
  );
};
interface MessageProps {
  message: ChatMessageItem;
  exchange: ChatMessageModel;
}

export const Message = (props: MessageProps) => {
  const message = useObserve(props.message);
  if (message instanceof HumanChatMessageItem) {
    return <HumanMessage message={message} exchange={props.exchange} />;
  }
  if (message instanceof AIChatMessageItem) {
    return <AIMessage message={message} exchange={props.exchange} />;
  }
  return null;
};
