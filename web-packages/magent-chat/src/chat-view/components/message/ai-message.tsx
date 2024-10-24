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

import type {
  BaseChatMessageItemModel,
  BaseChatMessageModel,
} from '../../../chat-base/protocol.js';
import { AnswerState } from '../../../chat-base/protocol.js';
import type { ChatView } from '../../view.js';
import { Markdown } from '../markdown/index.js';

interface AIMessageProps {
  message: BaseChatMessageModel;
  item: BaseChatMessageItemModel;
}

export const AIMessageError = (props: AIMessageProps) => {
  if (!props.item?.error?.message) {
    return null;
  }
  return (
    <div className={`chat-message-addon-error`}>ERROR: {props.item.error?.message}</div>
  );
};

export const AIMessageAddon = (props: AIMessageProps) => {
  const message = useObserve(props.message);
  let content = null;
  if (message.token) {
    content = (
      <div className={`chat-message-addon`}>
        {message.token.totalTokens && (
          <div className={`chat-message-addon-item`}>
            <span>Total token: {message.token.totalTokens}</span>
            <span>Completion: {message.token.completionTokens}</span>
            <span>Prompt: {message.token.promptTokens}</span>
          </div>
        )}
        {message.token.endTime && (
          <div className={`chat-message-addon-item`}>
            <span>
              结束时间: {message.token.endTime?.format('YYYY-MM-DD HH:mm:ss')}
            </span>
            {message.token.responseTime && (
              <span>耗时: {message.token.responseTime}</span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {content}
      <AIMessageError {...props} />
    </>
  );
};

export const AIMessageContent = (props: AIMessageProps) => {
  const item = useObserve(props.item);
  const content: ReactNode = item.content;
  if (!content) {
    return (
      <div
        className={classNames({
          ['chat-message-ai-empty']: true,
          ['chat-message-ai-error']: item.error,
        })}
      >
        <div className="chat-message-ai-content">
          {item.state === AnswerState.RECEIVING && (
            <LoadingOutlined className="chat-message-ai-receiving" />
          )}
        </div>
        <AIMessageAddon {...props} />
      </div>
    );
  } else {
    return (
      <div
        className={classNames({
          ['chat-message-ai']: true,
          ['chat-message-ai-error']: item.error,
        })}
      >
        <div className={classNames('markdown-message-md', 'chat-message-ai-content')}>
          <span className={`markdown-message-md-pop`}>
            <Markdown
              className={item.state !== AnswerState.RECEIVING ? 'tp-md' : ''}
              type="message"
            >
              {item.content}
            </Markdown>
          </span>
        </div>

        {item.state === AnswerState.RECEIVING && (
          <LoadingOutlined className="chat-message-ai-receiving" />
        )}
        <AIMessageAddon {...props} />
      </div>
    );
  }
};
export const AIMessage = (props: AIMessageProps) => {
  const item = useObserve(props.item);
  const instance = useInject<ChatView>(ViewInstance);
  const conversation = instance.conversation;
  const AvatarRender = instance.AvatarRender;
  if (!conversation) {
    return null;
  }

  // const [contentHover, setContentHover] = useState<boolean>(false);

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
        copy(item.content);
      }}
    >
      <CopyOutlined />
    </span>,
  ];

  return (
    <div className={classNames('chat-message-main', 'chat-message-main-ai')}>
      <AvatarRender type="AI" id={item.sender.id} />
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
