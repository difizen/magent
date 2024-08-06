import type { ChatMessageModel } from '../../../../modules/chat-message/chat-message-model.js';

import { Message } from './message.js';

interface MessageGroupProps {
  exchange: ChatMessageModel;
}
export const MessageExchange = (props: MessageGroupProps) => {
  const { exchange } = props;
  const [humanMsg, aiMsg] = exchange.messages;

  return (
    <div className="chat-message-exchange">
      {humanMsg && <Message exchange={exchange} message={humanMsg} />}
      {aiMsg && <Message exchange={exchange} message={aiMsg} />}
    </div>
  );
};
