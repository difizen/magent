import {
  CopyOutlined,
  DislikeOutlined,
  LikeOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useInject, useObserve, ViewInstance } from '@difizen/mana-app';
import type { StepProps } from 'antd';
import { Collapse, Steps } from 'antd';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import { useEffect, useState, type ReactNode } from 'react';

import { AgentIcon } from '@/modules/agent/agent-icon.js';
import type { ChatMessageModel } from '@/modules/chat-message/chat-message-model.js';
import type { PeerChatMessageItem } from '@/modules/chat-message/peer-message-item-model.js';
import type { StepContent } from '@/modules/chat-message/protocal.js';
import type { ChatEventStepQA } from '@/modules/chat-message/protocol.js';
import { AnswerState } from '@/modules/chat-message/protocol.js';

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

const StepsInMessage = (props: { content: StepContent; isLast: boolean }) => {
  return (
    <Steps
      direction="vertical"
      size="small"
      current={props.content.currentStep - props.content.roundStartsAt}
      className={`chat-message-peer-steps`}
      items={
        [
          props.content.roundStartsAt === 0
            ? {
                title: 'Planning',
                description: (
                  <MarkdownThought content={props.content.planningContent} />
                ),
                icon: props.content.currentStep === 0 ? <LoadingOutlined /> : undefined,
              }
            : (undefined as unknown as StepProps),
          props.content.roundStartsAt <= 1
            ? {
                title: 'Executing',
                description: <RenderExecuting qas={props.content.executingContent} />,
                icon: props.content.currentStep === 1 ? <LoadingOutlined /> : undefined,
              }
            : (undefined as unknown as StepProps),
          props.content.roundStartsAt <= 2
            ? {
                title: 'Expressing',
                description: (
                  <MarkdownThought
                    content={
                      !props.isLast
                        ? props.content.expressingContent
                        : props.content.expressingContent
                          ? props.content.currentStep === 2
                            ? '正文输出中...'
                            : '见回复正文'
                          : ''
                    }
                  />
                ),
                icon: props.content.currentStep === 2 ? <LoadingOutlined /> : undefined,
              }
            : (undefined as unknown as StepProps),
          {
            title: 'Reviewing',
            description: <MarkdownThought content={props.content.reviewingContent} />,
            icon: props.content.currentStep === 3 ? <LoadingOutlined /> : undefined,
          },
        ].filter((i) => i !== undefined) as StepProps[]
      }
    />
  );
};

const MultiStepRoundMessage = (props: {
  roundsContent: StepContent[];
  exchange: ChatMessageModel;
}) => {
  const [activeKey, setActiveKey] = useState<string[]>([]);

  useEffect(() => {
    // 每次 roundsContent 变化时，设置 activeKey 为最后一项
    const lastIndex = props.roundsContent.length - 1;
    if (lastIndex >= 0) {
      setActiveKey([`round${lastIndex}`]);
    } else {
      setActiveKey([]); // 如果 roundsContent 为空，则不展开
    }
  }, [props.roundsContent.length]);

  const handleChange = (key: string | string[]) => {
    // 更新 activeKey，支持多项展开
    setActiveKey((prevActiveKey) => {
      if (Array.isArray(key)) {
        return key;
      }
      const index = prevActiveKey.indexOf(key as string);
      if (index > -1) {
        return prevActiveKey.filter((k) => k !== key);
      } else {
        return [...prevActiveKey, key as string];
      }
    });
  };

  return props.roundsContent.map((content, idx) => {
    return (
      <Collapse
        key={`round_${idx + 1}`}
        className={`chat-message-peer-multi-round-container`}
        bordered={false}
        activeKey={activeKey} // 使用受控属性 activeKey
        onChange={handleChange} // 更新 activeKey
        items={[
          {
            key: 'round' + idx,
            label: 'round' + (idx + 1),
            children: (
              <StepsInMessage
                content={content}
                isLast={idx === props.roundsContent.length - 1}
              />
            ),
          },
        ]}
      />
    );
  });
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
  }
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
                <MultiStepRoundMessage
                  roundsContent={message.roundsContent}
                  exchange={exchange}
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
