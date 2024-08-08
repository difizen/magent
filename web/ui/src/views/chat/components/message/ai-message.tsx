import {
  CopyOutlined,
  DislikeOutlined,
  LikeOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useInject, useObserve, ViewInstance } from '@difizen/mana-app';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import type { ReactNode } from 'react';

import { AgentIcon } from '../../../../modules/agent/agent-icon.js';
import type { AIChatMessageItem } from '../../../../modules/chat-message/ai-message-item.js';
import type { ChatMessageModel } from '../../../../modules/chat-message/chat-message-model.js';
import { AnswerState } from '../../../../modules/chat-message/protocol.js';
import type { ChatView } from '../../view.js';

import { Markdown } from './markdown/index.js';

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

export const AIMessageContent = (props: AIMessageProps) => {
  const message = useObserve(props.message);
  const content: ReactNode = message.content;
  if (!content) {
    return (
      <div className={`chat-message-ai-empty`}>
        <LoadingOutlined className="chat-message-ai-receiving" />
      </div>
    );
  } else {
    return (
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
  const nickName = agent?.name || '';

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
      <AgentIcon className="chat-message-avatar" agent={agent} />
      <div className={`chat-message-container`}>
        <AIMessageContent {...props} />

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
