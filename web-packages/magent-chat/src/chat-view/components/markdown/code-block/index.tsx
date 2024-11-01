/* eslint-disable react-hooks/rules-of-hooks */
import { CopyOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { l10n } from '@difizen/mana-l10n';
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
        <div className={`chat-msg-md-code-type`}>
          {lang && <div className={`chat-msg-md-code-lang`}>{lang}</div>}
          <div className={`chat-msg-md-code-opArea`}>
            <div className={`chat-msg-md-code-op`}>
              <PlayCircleOutlined />
            </div>
            <div
              className={`chat-msg-md-code-op`}
              onClick={() => {
                copy(children);
                message.success(l10n.t('代码已复制'));
              }}
            >
              <CopyOutlined />
            </div>
          </div>
        </div>
        <SyntaxHighlighter
          className={`chat-msg-md-code-content`}
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
