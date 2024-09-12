import type { ReactNode } from 'react';

interface MessageGroupProps {
  children: ReactNode | ReactNode[];
}
export const MessageGroup = (props: MessageGroupProps) => {
  return <div className="chat-message-group">{props.children}</div>;
};
