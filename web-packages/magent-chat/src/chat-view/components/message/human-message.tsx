import { LoadingOutlined } from '@ant-design/icons';
import { useInject, useObserve, ViewInstance } from '@difizen/mana-app';
import { Space } from 'antd';
import classNames from 'classnames';
import type { ReactNode } from 'react';

import type {
  BaseChatMessageItemModel,
  BaseChatMessageModel,
} from '../../../chat-base/protocol.js';
import { QuestionState } from '../../../chat-base/protocol.js';
import type { ChatView } from '../../view.js';
import { TextMessage } from '../text/index.js';
import './index.less';

interface HumanMessageProps {
  message: BaseChatMessageModel;
  item: BaseChatMessageItemModel;
}
export const HumanMessageAddon = (props: HumanMessageProps) => {
  const message = useObserve(props.message);
  if (!message.created) {
    return null;
  }
  return (
    <div className={`chat-message-addon`}>
      <span>开始时间: {message.created.format('YYYY-MM-DD HH:mm:ss')}</span>
    </div>
  );
};
export const HumanMessage = (props: HumanMessageProps) => {
  const item = useObserve(props.item);
  const instance = useInject<ChatView>(ViewInstance);
  const conversation = instance.conversation;
  const AvatarRender = instance.AvatarRender;
  if (!conversation) {
    return null;
  }

  const content: ReactNode = (
    <>
      {item.state === QuestionState.SENDING && (
        <LoadingOutlined className="chat-message-human-sending" />
      )}
      <Space />
      {item.content || ''}
    </>
  );

  return (
    <div className={classNames('chat-message-main')}>
      <AvatarRender type="HUMAN" id={item.sender.id} />
      <div className="chat-message-human">
        <TextMessage content={content} />
        <HumanMessageAddon {...props} />
      </div>
    </div>
  );
};
