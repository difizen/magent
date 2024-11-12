import {
  VerticalAlignBottomOutlined,
  RobotOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  BaseView,
  Deferred,
  inject,
  prop,
  transient,
  view,
  ViewInstance,
  ViewManager,
  ViewOption,
} from '@difizen/mana-app';
import { useInject } from '@difizen/mana-app';
import { l10n } from '@difizen/mana-l10n';
import { Avatar, FloatButton } from 'antd';
import classnames from 'classnames';
import type { RefObject } from 'react';
import { forwardRef } from 'react';
import { useEffect, useRef } from 'react';
import breaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

import { ConversationManager } from '../chat-base/conversation-manager.js';
import type {
  BaseChatMessageItemModel,
  BaseConversationModel,
  IChatMessage,
} from '../chat-base/protocol.js';

import { Input } from './components/input/index.js';
import { CodeBlock } from './components/markdown/code-block/index.js';
import { DefaultMarkdown, ImageModal } from './components/markdown/index.js';
import { DefaultChatMessage, DefaultChatMessageItem } from './default-chat-message.js';
import './index.less';

export interface ChatProps {
  className?: string;
}

const DefaultAvatar = (props: {
  item: BaseChatMessageItemModel;
  className?: string;
}) => {
  const { item, className } = props;
  const type = item.sender.type;
  if (type === 'AI') {
    return (
      <Avatar
        className={classnames('chat-message-avatar', className)}
        icon={<RobotOutlined />}
      />
    );
  }
  return (
    <Avatar
      className={classnames('chat-message-avatar', className)}
      icon={<UserOutlined />}
    />
  );
};

const DefaultMessages = () => {
  const instance = useInject<ChatView>(ViewInstance);
  const ChatMessage = instance.ChatMessage;
  return (
    <>
      {instance.conversation && instance.conversation.messages.length ? (
        <>
          {instance.conversation?.messages.map((msg, index) => (
            <ChatMessage key={msg.id || index} message={msg} />
          ))}
          {instance.showToBottomBtn && (
            <FloatButton
              onClick={() => instance.scrollToBottom()}
              className="chat-content-list-to-bottom"
              icon={<VerticalAlignBottomOutlined />}
            />
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

const DefaultInput = () => {
  const instance = useInject<ChatView>(ViewInstance);
  return (
    <>
      {/* <div className="chat-content-input-mask"></div> */}
      <div className="chat-content-input-main">
        <Input onSubmit={(v) => instance.sendMessage(v)} />
      </div>
    </>
  );
};

const DefaultFooter = () => {
  return (
    <div className="chat-footer">
      {l10n.t('内容由AI生成，无法确保真实准确，仅供参考。')}
    </div>
  );
};

export const ChatComponent = forwardRef<HTMLDivElement, ChatProps>(
  function ChatComponent(props: ChatProps, ref) {
    const listRef = useRef<HTMLDivElement>(null);
    const { className } = props;
    const instance = useInject<ChatView>(ViewInstance);
    const Messages = instance.Messages;
    const Footer = instance.Footer;
    const ChatInput = instance.Input;

    useEffect(() => {
      instance.setMessageListContainer(listRef);
    }, [instance]);

    return (
      <div className={classnames('chat', className)} ref={ref}>
        <div className="chat-content">
          <div className="chat-content-list" ref={listRef} onScroll={instance.onScroll}>
            <Messages />
          </div>

          <div className="chat-content-input">
            <ChatInput />
          </div>
          <Footer />
        </div>
      </div>
    );
  },
);

const viewId = 'magent-chat';

export interface ChatViewOption extends IChatMessage {
  id: string;
}

@transient()
@view(viewId)
export class ChatView extends BaseView {
  @inject(ViewManager) viewManager: ViewManager;
  @inject(ConversationManager) conversationManager: ConversationManager;
  override view = ChatComponent;

  AvatarRender = DefaultAvatar;
  Messages = DefaultMessages;
  Input = DefaultInput;
  Footer = DefaultFooter;
  ChatMessage = DefaultChatMessage;
  ChatMessageItem = DefaultChatMessageItem;
  Markdown = DefaultMarkdown;

  getMarkdownProps() {
    return {
      components: { code: CodeBlock, img: ImageModal },
      remarkPlugins: [remarkGfm, breaks],
    };
  }

  option: ChatViewOption;

  @prop()
  showToBottomBtn = false;

  @prop()
  conversation?: BaseConversationModel;

  conversationReady: Promise<BaseConversationModel>;
  protected conversationDeferred: Deferred<BaseConversationModel> =
    new Deferred<BaseConversationModel>();

  /**
   * A container DOM node for messages,
   * making it convenient for scroll control and other functions.
   */
  protected messageListRef?: RefObject<HTMLDivElement>;

  constructor(@inject(ViewOption) option: ChatViewOption) {
    super();
    this.option = option;
    // setImmediate(this.initConversation);
  }

  get sendable(): boolean {
    return true;
  }

  protected toMessageOption(msgContent: string) {
    return {
      stream: true,
      ...this.option,
      sender: { type: 'HUMAN' },
      input: msgContent,
    };
  }

  sendMessage = async (msgContent: string) => {
    if (!this.id) {
      return;
    }
    const msg: IChatMessage = this.toMessageOption(msgContent);
    delete msg.id;
    delete msg.messages;
    delete msg.created;
    delete msg.modified;
    this.conversation?.sendMessage(msg);
    setImmediate(this.scrollToBottom);
  };

  override onViewMount() {
    this.initConversation();
  }

  protected toConversationOption() {
    return {
      ...this.option,
      messages: [],
    };
  }

  protected initConversation = async () => {
    this.conversation = this.conversationManager.getOrCreate(
      this.toConversationOption(),
    );
    const toDispose = this.conversation.onMessage(() =>
      setImmediate(() => {
        if (!this.showToBottomBtn) {
          this.scrollToBottom();
        }
      }),
    );
    this.toDispose.push(toDispose);
    this.conversationDeferred.resolve(this.conversation);
  };

  clear = async () => {
    // if (!this.id) {
    //   return;
    // }
    // const url = `api/v1/chats/${this.id!}/messages`;
    // const res = await this.axios.delete<number>(url);
    // if (res.status === 200) {
    //   this.messages = [];
    //   return true;
    // }
    // return false;
  };

  scrollToBottom = (immediately = false, smoothly = true) => {
    const dom = this.messageListRef?.current;
    if (!dom) {
      return;
    }
    const top = dom.scrollHeight - dom.clientHeight;

    // immdiately scroll to bottom
    if (immediately) {
      dom.scrollTop = top;
      return;
    }
    // smoothly scroll to bottom
    dom.scrollTo({
      top,
      behavior: smoothly ? 'smooth' : 'auto',
    });
  };

  onScroll = () => {
    const dom = this.messageListRef?.current;
    if (!dom) {
      return;
    }
    const bottomToTop = dom.scrollTop + dom.clientHeight;
    if (dom.scrollHeight - bottomToTop < 120) {
      this.showToBottomBtn = false;
    } else {
      this.showToBottomBtn = true;
    }
  };

  setMessageListContainer = (domRef: RefObject<HTMLDivElement>) => {
    this.messageListRef = domRef;
  };
}
