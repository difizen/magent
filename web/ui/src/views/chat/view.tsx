import { VerticalAlignBottomOutlined } from '@ant-design/icons';
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
import { FloatButton } from 'antd';
import classnames from 'classnames';
import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

import { AgentManager } from '../../modules/agent/agent-manager.js';
import type { AgentModel } from '../../modules/agent/protocol.js';
import { AxiosClient } from '../../modules/axios-client/index.js';
import { ChatMessageManager } from '../../modules/chat-message/chat-message-manager.js';
import type { MessageCreate } from '../../modules/chat-message/protocol.js';
import { SessionManager } from '../../modules/session/session-manager.js';
import type { SessionModel } from '../../modules/session/session-model.js';

import { Input } from './components/input/index.js';
import { MessageExchange } from './components/message/exchange.js';
import './index.less';

export interface ChatProps {
  className?: string;
}
export function ChatComponent(props: ChatProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const { className } = props;
  const instance = useInject<ChatView>(ViewInstance);

  useEffect(() => {
    instance.setMessageListContainer(listRef);
  }, [instance]);

  return (
    <div className={classnames('chat', className)}>
      <div className="chat-content">
        <div className="chat-content-list" ref={listRef} onScroll={instance.onScroll}>
          {instance.session?.messages.map((msg) => (
            <MessageExchange key={msg.id} exchange={msg} />
          ))}
          {instance.showToBottomBtn && (
            <FloatButton
              onClick={() => instance.scrollToBottom()}
              className="chat-content-list-to-bottom"
              icon={<VerticalAlignBottomOutlined />}
            />
          )}
        </div>
        <div className="chat-content-input">
          <div className="chat-content-input-mask"></div>
          <div className="chat-content-input-main">
            {/* <Button
              className="chat-content-input-main-clear"
              icon={<ClearOutlined />}
              onClick={() => instance.clear()}
            ></Button> */}
            {/* <Input onSubmit={(v) => chat.sendMessageStream(v)} /> */}
            <Input onSubmit={(v) => instance.sendMessage(v)} />
          </div>
        </div>
        <div className="chat-footer">内容由AI生成，无法确保真实准确，仅供参考。</div>
      </div>
    </div>
  );
}

const viewId = 'magent-chat';

export interface ChatViewOption {
  agentId: string;
  sessionId: string;
}

@transient()
@view(viewId)
export class ChatView extends BaseView {
  @inject(ViewManager) viewManager: ViewManager;
  override view = ChatComponent;
  protected agentManager: AgentManager;
  protected messageManager: ChatMessageManager;
  protected sessionManager: SessionManager;
  axios: AxiosClient;
  option: ChatViewOption;
  agentId: string;
  sessionId: string;

  @prop()
  agent?: AgentModel;

  @prop()
  session?: SessionModel;

  @prop()
  showToBottomBtn = false;

  agentReady: Promise<AgentModel>;
  protected agentDeferred: Deferred<AgentModel> = new Deferred<AgentModel>();
  sessionReady: Promise<SessionModel>;
  protected sessionDeferred: Deferred<SessionModel> = new Deferred<SessionModel>();

  /**
   * A container DOM node for messages,
   * making it convenient for scroll control and other functions.
   */
  protected messageListRef?: RefObject<HTMLDivElement>;

  constructor(
    @inject(ViewOption) option: ChatViewOption,
    @inject(AxiosClient) axios: AxiosClient,
    @inject(ChatMessageManager) messageManager: ChatMessageManager,
    @inject(SessionManager) sessionManager: SessionManager,
    @inject(AgentManager) agentManager: AgentManager,
  ) {
    super();
    this.axios = axios;
    this.messageManager = messageManager;
    this.agentManager = agentManager;
    this.sessionManager = sessionManager;
    this.option = option;
    this.agentId = option.agentId;
    this.sessionId = option.sessionId;
    this.getAgent(this.agentId);
    this.getSession(this.sessionId);
  }

  protected getAgent = async (id: string) => {
    this.agent = await this.agentManager.getOrCreateAgent({ id });
    this.agentDeferred.resolve(this.agent);
  };

  protected getSession = async (id: string) => {
    this.session = await this.sessionManager.getOrCreateSession({
      id,
      agentId: this.agentId,
    });
    const toDispose = this.session.onMessage(() => setImmediate(this.scrollToBottom));
    this.toDispose.push(toDispose);
    this.sessionDeferred.resolve(this.session);
  };

  sendMessage = async (msgContent: string) => {
    if (!this.id) {
      return;
    }
    const msg: MessageCreate = {
      agentId: this.agentId,
      sessionId: this.sessionId,
      input: msgContent,
    };
    this.session?.chat(msg);
    setImmediate(this.scrollToBottom);
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
