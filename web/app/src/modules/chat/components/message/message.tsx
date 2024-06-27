import { useInject, useObserve } from '@difizen/mana-app';
import { Avatar } from 'antd';

import type { AgentBot } from '../../../agent-bot/protocol.js';
import { BotInstance } from '../../../agent-bot/protocol.js';
import { ChatInstance, MessageSenderType, type ChatMessage } from '../../protocol.js';
import './index.less';
import classNames from 'classnames';

interface MessageProps {
  message: ChatMessage;
}
export const Message = (props: MessageProps) => {
  const message = useObserve(props.message);
  const bot = useInject<AgentBot>(BotInstance);
  const chat = useInject(ChatInstance);
  let avatarSrc = 'https://api.dicebear.com/7.x/miniavs/svg?seed=1';
  let nickName = 'user';
  if (message.senderType === MessageSenderType.AI) {
    avatarSrc = bot.avatar!;
    nickName = 'bot';
  }
  return (
    <div className="chat-message">
      <div className="chat-message-box">
        <div className="chat-message-avatar">
          <Avatar src={avatarSrc} />
        </div>
        <div className="chat-message-container">
          <div className="chat-message-nickname">{nickName}</div>
          <div className="chat-message-content">
            <div
              className={classNames('chat-message-content-inner', {
                'chat-message-content-bot': message.senderType === MessageSenderType.AI,
                'chat-message-content-user':
                  message.senderType === MessageSenderType.HUMAN,
              })}
            >
              {message.content}
            </div>
          </div>
          <div className="chat-message-footer"></div>
        </div>
      </div>
    </div>
  );
};
