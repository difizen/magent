import { useObserve } from '@difizen/mana-app';

import { AIChatMessageItemModel } from '../../../chat-base/ai-message-item-model.js';
import { HumanChatMessageItemModel } from '../../../chat-base/chat-message-item-model.js';
import type {
  BaseChatMessageItemModel,
  BaseChatMessageModel,
} from '../../../chat-base/protocol.js';

import { AIMessage } from './ai-message.js';
import { HumanMessage } from './human-message.js';
import './index.less';

interface MessageProps {
  message: BaseChatMessageModel;
  item: BaseChatMessageItemModel;
}

export const Message = (props: MessageProps) => {
  const message = useObserve(props.message);
  if (message instanceof HumanChatMessageItemModel) {
    return <HumanMessage {...props} />;
  }
  if (message instanceof AIChatMessageItemModel) {
    return <AIMessage {...props} />;
  }
  return null;
};
