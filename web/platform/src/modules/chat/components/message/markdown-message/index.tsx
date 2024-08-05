import { useRef } from 'react';

import { Markdown } from '../Markdown/index.js';

import './index.less';

export const MarkdownMessage = ({ content }: any) => {
  const mdRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={mdRef} className={`markdown-message-md`}>
      <span className={`markdown-message-mdPop`}>
        <Markdown type="message">{content}</Markdown>
      </span>
    </div>
  );
};
