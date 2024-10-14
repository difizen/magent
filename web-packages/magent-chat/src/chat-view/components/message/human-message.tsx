import { LoadingOutlined } from '@ant-design/icons';
import { useInject, useObserve, ViewInstance } from '@difizen/mana-app';
import { Avatar, Space } from 'antd';
import classNames from 'classnames';
import type { ReactNode } from 'react';

import type {
  BaseChatMessageItemModel,
  BaseChatMessageModel,
} from '../../../chat-base/protocol.js';
import { QuestionState } from '../../../chat-base/protocol.js';
import type { ChatView } from '../../view.js';
import { TextMessage } from '../text/index.js';
import './index.less';

interface HumanMessageProps {
  message: BaseChatMessageModel;
  item: BaseChatMessageItemModel;
}
export const HumanMessageAddon = (props: HumanMessageProps) => {
  const message = useObserve(props.message);
  if (!message.created) {
    return null;
  }
  return (
    <div className={`chat-message-addon`}>
      <span>开始时间: {message.created.format('YYYY-MM-DD HH:mm:ss')}</span>
    </div>
  );
};
export const HumanMessage = (props: HumanMessageProps) => {
  const item = useObserve(props.item);
  const instance = useInject<ChatView>(ViewInstance);
  const conversation = instance.conversation;
  const AvatarRender = instance.AvatarRender;
  if (!conversation) {
    return null;
  }

  const content: ReactNode = (
    <>
      {item.state === QuestionState.SENDING && (
        <LoadingOutlined className="chat-message-human-sending" />
      )}
      <Space />
      {item.content || ''}
    </>
  );

  return (
    <div className={classNames('chat-message-main')}>
      <AvatarRender type="HUMAN" id={item.sender.id} />
      <div className="chat-message-human">
        <TextMessage content={content} />
        <HumanMessageAddon {...props} />
      </div>
    </div>
  );
};

export const HumanIcon = () => {
  return (
    <svg
      className="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
    >
      <path
        d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z"
        fill="#F4F7FF"
      ></path>
      <path
        d="M512 512m-450.865672 0a450.865672 450.865672 0 1 0 901.731344 0 450.865672 450.865672 0 1 0-901.731344 0Z"
        fill="#B3CBFE"
      ></path>
      <path
        d="M351.522388 908.608955c-28.274627-150.543284 25.21791-218.555224 159.713433-204.035821 134.495522-12.991045 188.752239 55.020896 162.00597 204.035821-19.104478 25.98209-73.361194 38.973134-161.241791 38.973135s-141.373134-12.991045-160.477612-38.973135z"
        fill="#5FBDFB"
      ></path>
      <path
        d="M259.820896 520.40597c21.397015 29.802985 35.916418 51.964179 43.558208 68.01194 11.462687 23.689552 12.226866 103.928358 160.477612 103.928359 0.764179 0.764179 19.104478 9.170149 53.492538 25.982089l42.79403-25.982089c73.361194 3.820896 120.740299-10.698507 142.901492-43.558209 33.623881-48.907463 19.868657-38.973134 34.38806-68.011941 14.519403-29.038806 53.492537-77.946269 22.925373-129.910447-20.632836-34.38806-101.635821-85.58806-244.537313-152.835821l-198.686568 79.474627L259.820896 468.441791v51.964179z"
        fill="#FFE2C2"
      ></path>
      <path
        d="M518.877612 322.483582c-25.21791 51.964179-53.492537 85.58806-85.58806 100.871642-47.379104 22.161194-145.19403-29.038806-176.525373 88.644776 0 3.820896-93.99403-306.435821 238.423881-320.955224 215.498507 0.764179 308.728358 104.692537 278.161194 311.785075l-48.907463-68.77612C618.220896 454.686567 550.208955 417.241791 520.40597 322.483582c1.528358 1.528358 0.764179 1.528358-1.528358 0z"
        fill="#333333"
      ></path>
    </svg>
  );
};