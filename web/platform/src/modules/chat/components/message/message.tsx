import {
  CopyOutlined,
  DislikeOutlined,
  LikeOutlined,
  LoadingOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useInject, useObserve } from '@difizen/mana-app';
import { Avatar } from 'antd';
import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import type { ReactNode } from 'react';
// import { useState } from 'react';

import type { Chat, ChatMessage } from '../../protocol.js';
import { ChatInstance, MessageSenderType } from '../../protocol.js';
import Typing from '../typing/index.js';

import './index.less';

import { MarkdownMessage } from './markdown-message/index.js';
import { TextMessage } from './text/index.js';

interface MessageProps {
  message: ChatMessage;
}

// const defaultgptIcon =
//   'https://mdn.alipayobjects.com/huamei_yfyi3l/afts/img/A*cbWWRrggkugAAAAAAAAAAAAADheqAQ/original';

export const Message = (props: MessageProps) => {
  const message = useObserve(props.message);
  const chat = useInject<Chat>(ChatInstance);

  // const [contentHover, setContentHover] = useState<boolean>(false);
  let avatarSrc = 'https://api.dicebear.com/7.x/miniavs/svg?seed=1';
  // let nickName = 'user';
  if (message.senderType === MessageSenderType.AI && chat.bot?.avatar) {
    avatarSrc = chat.bot?.avatar;
    // nickName = chat.bot?.name;
  }
  if (message.senderType === MessageSenderType.HUMAN && message.sender?.avatar) {
    avatarSrc = message.sender?.avatar;
    // nickName = message.sender.name;
  }

  let content: ReactNode = message.content;
  if (!message.complete) {
    content = (
      <>
        {message.content}
        <Typing />
      </>
    );
  }
  if (!content) {
    content = <LoadingOutlined />;
  }

  const actions = [
    <span key={'actionsTag3'} className={`chat-message-actionsTag`}>
      <LikeOutlined />
    </span>,
    <span key={'actionsTag2'} className={`chat-message-actionsTag`}>
      <DislikeOutlined />
    </span>,
    <span
      key={'actionsTag1'}
      className={`chat-message-actionsTag`}
      onClick={() => {
        copy(message.content);
      }}
    >
      <CopyOutlined />
    </span>,
  ];

  return (
    <div
      className={classNames(
        'chat-message-main',
        message.senderType === MessageSenderType.AI ? 'chat-message-modalMain' : '',
      )}
    >
      <Avatar src={avatarSrc} />
      {message.senderType === MessageSenderType.AI ? (
        <div className={`chat-message-msgContainer`}>
          <MarkdownMessage
            content={content}
            // content={
            //   messageSnap.state === AnswerState.Sending
            //     ? intlMessage({ id: 'please_wait' })
            //     : messageSnap.content
            // }
          />
          <div style={{ paddingTop: 8, display: 'flex' }}>
            <div
              className={'chat-message-retry'}
              onClick={() => {
                // TODO:
              }}
            >
              <ReloadOutlined style={{ marginRight: '5px' }} />
              重新生成
            </div>
            <div className={'chat-message-actions'}>
              {message.senderType === MessageSenderType.AI
                ? actions.filter(Boolean)
                : ''}
            </div>
          </div>
        </div>
      ) : (
        <TextMessage content={content} />
      )}
    </div>
  );
};
