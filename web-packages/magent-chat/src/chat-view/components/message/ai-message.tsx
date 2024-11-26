import { LoadingOutlined, RightOutlined } from '@ant-design/icons';
import { useInject, useObserve, ViewInstance } from '@difizen/mana-app';
import { l10n } from '@difizen/mana-l10n';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import type { ReactNode } from 'react';

import type {
  BaseChatMessageItemModel,
  BaseChatMessageModel,
} from '../../../chat-base/protocol.js';
import { AnswerState } from '../../../chat-base/protocol.js';
import { MesssageOpProvider } from '../../protocol.js';
import type { ChatView } from '../../view.js';

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
              {l10n.t('结束时间')}:{' '}
              {message.token.endTime?.format('YYYY-MM-DD HH:mm:ss')}
            </span>
            {message.token.responseTime && (
              <span>
                {l10n.t('耗时')}: {message.token.responseTime}
              </span>
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

export const RecommendQuestions = (props: { message: BaseChatMessageModel }) => {
  const instance = useInject<ChatView>(ViewInstance);
  if (
    !props.message ||
    !props.message.recommentQustions ||
    !props.message.recommentQustions.length
  ) {
    return null;
  }

  return (
    <div className="chat-message-ai-recommend-questions">
      {props.message.recommentQustions.map((question, idx) => {
        return (
          <div
            key={`${props.message.id}-question-${idx}`}
            style={{ width: 'auto', animationDelay: `${0.07 * (idx + 2)}s` }}
            className="chat-message-ai-recommend-questions-item"
            onClick={async () => {
              debounce(() => instance?.sendMessage(question), 500);
            }}
          >
            <div className="chat-message-ai-recommend-questions-item-container">
              <span>{question}</span>
              <RightOutlined className="chat-message-ai-recommend-questions-item-arrow" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const AIMessageContent = (props: AIMessageProps) => {
  const item = useObserve(props.item);
  const instance = useInject<ChatView>(ViewInstance);
  const Markdown = instance.Markdown;
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
              type="message"
              {...instance.getMarkdownProps()}
              className={item.state !== AnswerState.RECEIVING ? 'tp-md' : ''}
            >
              {item.content +
                `${item.state === AnswerState.RECEIVING ? '![cursor](https://mdn.alipayobjects.com/huamei_enmr8b/afts/img/A*Ou5LR4JY3j8AAAAAAAAAAAAADtGPAQ/original)' : ''}`}
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

  const MesssageOp = useInject<MesssageOpProvider>(MesssageOpProvider);

  if (!conversation) {
    return null;
  }

  // const [contentHover, setContentHover] = useState<boolean>(false);

  return (
    <div className={classNames('chat-message-main', 'chat-message-main-ai')}>
      <AvatarRender item={item} />
      <div className={`chat-message-container`}>
        <AIMessageContent {...props} />

        <MesssageOp item={props.item} message={props.message} />

        <RecommendQuestions message={props.message} />
      </div>
    </div>
  );
};
