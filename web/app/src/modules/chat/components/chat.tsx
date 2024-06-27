import { ClearOutlined } from '@ant-design/icons';
import { useInject } from '@difizen/mana-app';
import { Button } from 'antd';
import classnames from 'classnames';

import type { Chat as ChatType } from '../protocol.js';
import { ChatInstance } from '../protocol.js';

import { Input } from './input/index.js';
import { Message } from './message/message.js';
import './index.less';

export interface ChatProps {
  className?: string;
}
export function Chat(props: ChatProps) {
  const { className } = props;
  const chat = useInject<ChatType>(ChatInstance);
  return (
    <div className={classnames('chat', className)}>
      <div className="chat-content">
        <div className="chat-content-list">
          {chat.messages.map((msg) => (
            <Message key={msg.id} message={msg} />
          ))}
        </div>
        <div className="chat-content-input">
          <div className="chat-content-input-mask"></div>
          <div className="chat-content-input-main">
            <Button
              className="chat-content-input-main-clear"
              icon={<ClearOutlined />}
              onClick={() => chat.clear()}
            ></Button>
            <Input onSubmit={(v) => chat.sendMessageStream(v)} />
          </div>
        </div>
        <div className="chat-footer">内容由AI生成，无法确保真实准确，仅供参考。</div>
      </div>
    </div>
  );
}
