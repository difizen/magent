import type { FC } from 'react';
import './index.less';

export interface TypingProps {
  loading?: boolean;
  /**
   * 颜色
   * @default colorText rgba(0, 0, 0, 0.88)
   */
  color?: string;
}

export const Typing: FC<TypingProps> = (props) => {
  return <div className="chat-input-typing" />;
};

export default Typing;
