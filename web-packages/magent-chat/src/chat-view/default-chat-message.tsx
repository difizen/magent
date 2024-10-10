import { useInject, ViewInstance } from '@difizen/mana-app';

import type {
  BaseChatMessageItemModel,
  BaseChatMessageModel,
} from '../chat-base/protocol.js';

import { ChatMessageRender } from './chat-message-render.js';
import type { ChatView } from './view.js';

export const DefaultChatMessageItem = (props: {
  message: BaseChatMessageModel;
  item: BaseChatMessageItemModel;
}) => {
  const chatMessageRender = useInject(ChatMessageRender);
  const Render = chatMessageRender.getChatItemRender(props.item);
  return <Render {...props} />;
};

export const DefaultChatMessage = (props: { message: BaseChatMessageModel }) => {
  const { message } = props;
  const instance = useInject<ChatView>(ViewInstance);

  const ChatMessageItem = instance.ChatMessageItem;
  return (
    <div className="chat-message-exchange">
      {message.items.map((msg) => (
        <ChatMessageItem key={msg.id} message={message} item={msg} />
      ))}
    </div>
  );
};
