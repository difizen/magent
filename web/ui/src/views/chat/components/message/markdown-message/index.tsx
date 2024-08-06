import { useRef } from 'react';

import { Markdown } from '../markdown/index.js';

import './index.less';

export const MarkdownMessage = ({ message }: any) => {
  const mdRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={mdRef} className={`markdown-message-md`}>
      <span className={`markdown-message-mdPop`}>
        <Markdown message={message} type="message">
          {message.content}
        </Markdown>
      </span>
    </div>
  );
};
