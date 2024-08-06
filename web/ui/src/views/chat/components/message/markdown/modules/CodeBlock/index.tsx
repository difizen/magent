/* eslint-disable react-hooks/rules-of-hooks */
import { CopyOutlined } from '@ant-design/icons';
import { message } from 'antd';
import copy from 'copy-to-clipboard';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import './index.less';

export const CodeBlock = (props: any) => {
  const { className, children } = props;

  if (!props.inline) {
    const [, lang] = /language-(\w+)/.exec(className || '') || [];

    return (
      <pre className={`chat-msg-md-code-wrap`}>
        {lang && <div className={`chat-msg-md-code-lang`}>{lang}</div>}
        <CopyOutlined
          onClick={() => {
            copy(children);
            message.success('代码已复制');
          }}
          className={`chat-msg-md-code-copy`}
        />
        <SyntaxHighlighter
          className={`chat-msg-md-code-pre`}
          language={lang}
          style={oneDark}
        >
          {typeof children === 'string' ? children.trim() : children}
        </SyntaxHighlighter>
      </pre>
    );
  }

  return <code className={`chat-msg-md-code-code`}>{children}</code>;
};
