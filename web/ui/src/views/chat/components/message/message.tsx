import { useObserve } from '@difizen/mana-app';

import { AIChatMessageItem } from '../../../../modules/chat-message/ai-message-item.js';
import type { ChatMessageItem } from '../../../../modules/chat-message/chat-message-item.js';
import { HumanChatMessageItem } from '../../../../modules/chat-message/chat-message-item.js';
import type { ChatMessageModel } from '../../../../modules/chat-message/chat-message-model.js';
import { PeerChatMessageItem } from '../../../../modules/chat-message/peer-message-item-model.js';

import { AIMessage } from './ai-message.js';
import { HumanMessage } from './human-message.js';
import './index.less';
import { PeerMessage } from './peer-message.js';

interface MessageProps {
  message: ChatMessageItem;
  exchange: ChatMessageModel;
}

export const Message = (props: MessageProps) => {
  const message = useObserve(props.message);
  if (message instanceof HumanChatMessageItem) {
    return <HumanMessage message={message} exchange={props.exchange} />;
  }
  if (message instanceof PeerChatMessageItem) {
    return <PeerMessage message={message} exchange={props.exchange} />;
  }
  if (message instanceof AIChatMessageItem) {
    return <AIMessage message={message} exchange={props.exchange} />;
  }
  return null;
};
