import classnames from 'classnames';

import { Input } from './input/index.js';
import './index.less';

export interface ChatProps {
  className?: string;
}
export function Chat(props: ChatProps) {
  const { className } = props;
  return (
    <div className={classnames('chat', className)}>
      <div className="chat-content">
        <div className="chat-content-list"></div>
        <Input wrapperClassName="chat-content-input" />
      </div>
    </div>
  );
}
