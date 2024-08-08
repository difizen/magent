import {
  CopyOutlined,
  DislikeOutlined,
  LikeOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useInject, useObserve, ViewInstance } from '@difizen/mana-app';
import { Collapse, Steps } from 'antd';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import type { ReactNode } from 'react';

import { AgentIcon } from '../../../../modules/agent/agent-icon.js';
import type { ChatMessageModel } from '../../../../modules/chat-message/chat-message-model.js';
import type { PeerChatMessageItem } from '../../../../modules/chat-message/peer-message-item-model.js';
import type { ChatEventStepQA } from '../../../../modules/chat-message/protocol.js';
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

export const RenderExecuting = (props: { qas: ChatEventStepQA[] }) => {
  const { qas } = props;

  return (
    <Collapse
      ghost
      defaultActiveKey={qas.map((i) => i.input)}
      items={qas.map((item) => ({
        key: item.input,
        label: item.input,
        children: (
          <div key={item.input} className="chat-message-peer-steps-step">
            <div className={`markdown-message-md`}>
              <span className={`markdown-message-md-pop`}>
                <Markdown type="message">{item.output}</Markdown>
              </span>
            </div>
          </div>
        ),
      }))}
    />
  );
};

export const MarkdownThought = (props: { content: string }) => {
  return (
    <div className={`markdown-message-md`}>
      <span className={`markdown-message-md-pop`}>
        <Markdown type="message">{props.content}</Markdown>
      </span>
    </div>
  );
};

export const AIMessageContent = (props: AIMessageProps) => {
  const message = useObserve(props.message);
  const exchange = useObserve(props.exchange);
  const content: ReactNode = message.content;
  if (!content && !message.received) {
    return (
      <div className={`chat-message-ai-empty`}>
        <LoadingOutlined className="chat-message-ai-receiving" />
      </div>
    );
  } else {
    return (
      <div className={`chat-message-ai chat-message-peer`}>
        {message.planningPlanner && message.received && (
          <Collapse
            className={`chat-message-peer-container`}
            bordered={false}
            defaultActiveKey={['peer']}
            items={[
              {
                key: 'peer',
                label: `${message.agent?.name} ${exchange.tokenUsage ? '思考过程' : '思考中...'}`,
                children: (
                  <Steps
                    direction="vertical"
                    size="small"
                    current={message.currentStep}
                    className={`chat-message-peer-steps`}
                    items={[
                      {
                        title: 'Planning',
                        description: (
                          <MarkdownThought content={message.planningContent} />
                        ),
                        icon:
                          message.currentStep === 0 ? <LoadingOutlined /> : undefined,
                      },
                      {
                        title: 'Executing',
                        description: <RenderExecuting qas={message.executingContent} />,
                        icon:
                          message.currentStep === 1 ? <LoadingOutlined /> : undefined,
                      },
                      {
                        title: 'Expressing',
                        description: message.expressingContent
                          ? message.currentStep === 2
                            ? '正文输出中...'
                            : '见回复正文'
                          : '',
                        icon:
                          message.currentStep === 2 ? <LoadingOutlined /> : undefined,
                      },
                      {
                        title: 'Reviewing',
                        description: (
                          <MarkdownThought content={message.reviewingContent} />
                        ),
                        icon:
                          message.currentStep === 3 ? <LoadingOutlined /> : undefined,
                      },
                    ]}
                  />
                ),
              },
            ]}
          />
        )}

        <div className={`markdown-message-md`}>
          <span className={`markdown-message-md-pop`}>
            <Markdown
              className={message.state !== AnswerState.RECEIVING ? 'tp-md' : ''}
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
