import {
  CopyOutlined,
  DislikeOutlined,
  LikeOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useInject, useObserve, ViewInstance } from '@difizen/mana-app';
import { Avatar, Steps } from 'antd';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import type { ReactNode } from 'react';

import { MagentLOGO } from '../../../../modules/base-layout/brand/logo.js';
import type { ChatMessageModel } from '../../../../modules/chat-message/chat-message-model.js';
import type {
  PeerChatMessageItem,
  PeerSteps,
} from '../../../../modules/chat-message/peer-message-item-model.js';
import { AnswerState } from '../../../../modules/chat-message/protocol.js';
import type { ChatView } from '../../view.js';

import { Markdown } from './markdown/index.js';

import './peer.less';

interface AIMessageProps {
  message: PeerChatMessageItem;
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

export const PeerStep = (props: { step: PeerSteps }) => {
  const { step } = props;
  if (!step || !step.output) {
    return null;
  }
  if (typeof step.output === 'string') {
    return (
      <div className="chat-message-peer-steps-step">
        <div className="chat-message-peer-steps-step-item">{step.output}</div>
      </div>
    );
  }
  return (
    <div className="chat-message-peer-steps-step">
      {step.output.map((i) => (
        <div key={i.toString() + i}>
          {typeof i === 'string' ? (
            <div className="chat-message-peer-steps-step-item">{i}</div>
          ) : (
            <div className="chat-message-peer-steps-step-item">
              <div className="chat-message-peer-steps-step-item-in">{i.input}</div>
              <div className="chat-message-peer-steps-step-item-out">{i.output}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const RenderPeerPlanner = (props: { message: PeerChatMessageItem }) => {
  const { message } = props;
  if (message.currentStep === 0) {
    return <PeerStep step={message.steps[0]} />;
  }

  let content = message.planningContent;
  try {
    const data = JSON.parse(content);
    content = data.thought;
  } catch (e) {
    content = '';
  }
  return (
    <div className="chat-message-peer-steps-step">
      <div className="chat-message-peer-steps-step-item">{content}</div>
    </div>
  );
};

export const AIMessageContent = (props: AIMessageProps) => {
  const message = useObserve(props.message);
  const content: ReactNode = message.content;
  if (!content && !message.planningContent) {
    return (
      <div className={`chat-message-ai-empty`}>
        <LoadingOutlined className="chat-message-ai-receiving" />
      </div>
    );
  } else {
    return (
      <div className={`chat-message-ai chat-message-peer`}>
        {message.planningPlanner &&
          (message.planningContent || message.steps.length > 0) && (
            <Steps
              direction="vertical"
              size="small"
              current={message.currentStep}
              className={`chat-message-peer-steps`}
              items={[
                {
                  title: 'Planning',
                  description: <RenderPeerPlanner message={message} />,
                  icon: message.currentStep === 0 ? <LoadingOutlined /> : undefined,
                },
                {
                  title: 'Executing',
                  description: <PeerStep step={message.steps[1]} />,
                  icon: message.currentStep === 1 ? <LoadingOutlined /> : undefined,
                },
                {
                  title: 'Reviewing',
                  description: <PeerStep step={message.steps[2]} />,
                  icon: message.currentStep === 3 ? <LoadingOutlined /> : undefined,
                },
                {
                  title: 'Expressing',
                  description: <PeerStep step={message.steps[3]} />,
                  icon: message.currentStep === 2 ? <LoadingOutlined /> : undefined,
                },
              ]}
            />
          )}

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

export const PeerMessage = (props: AIMessageProps) => {
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
