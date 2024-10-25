import { VerticalAlignBottomOutlined } from '@ant-design/icons';
import type { BaseChatMessageItemModel, IChatMessage } from '@difizen/magent-chat';
import { ChatView } from '@difizen/magent-chat';
import {
  Deferred,
  inject,
  prop,
  transient,
  useInject,
  useObserve,
  view,
  ViewInstance,
  ViewOption,
} from '@difizen/mana-app';
import { Avatar, FloatButton } from 'antd';
import classnames from 'classnames';
import classNames from 'classnames';

import { AgentIcon } from '../agent/agent-icon.js';
import { AgentManager } from '../agent/agent-manager.js';
import type { AgentModel } from '../agent/agent-model.js';

import { AUAgentChatMessageItem } from './ai-message-item.js';
import { HumanIcon } from './icon.js';

const viewId = 'magent-chat';

export const OpeningSpeechMessage = (props: { agent: AgentModel | undefined }) => {
  const agent = useObserve(props.agent);
  return (
    <div className={classNames('chat-message-main', 'chat-message-main-ai')}>
      <AgentIcon className="chat-message-avatar" agent={agent} />
      <div className={`chat-message-container`}>
        <div className={`chat-message-ai`}>
          <div className={`markdown-message-md`}>
            <span className={`markdown-message-md-pop`}>
              <div className="chat-msg-md chat-msg-md-message tp-md">
                <p>{agent?.openingSpeech}</p>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AUMessages = () => {
  const instance = useInject<AUChatView>(ViewInstance);
  const ChatMessage = instance.ChatMessage;
  return (
    <>
      {instance.agent?.openingSpeech && <OpeningSpeechMessage agent={instance.agent} />}
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

const AUAvatar = (props: { item: BaseChatMessageItemModel; className?: string }) => {
  const { item, className } = props;
  const type = item.sender.type;
  if (type === 'AI' && item instanceof AUAgentChatMessageItem) {
    if (item instanceof AUAgentChatMessageItem) {
      return (
        <AgentIcon
          agent={item.agent}
          className={classnames('chat-message-avatar', className)}
        />
      );
    }
  }
  return <Avatar className="chat-message-avatar" src={<HumanIcon />} />;
};

export interface ChatViewOption extends IChatMessage {
  id: string;
}

@transient()
@view(viewId)
export class AUChatView extends ChatView {
  @inject(AgentManager) agentManager: AgentManager;
  override Messages = AUMessages;
  override AvatarRender = AUAvatar;

  @prop()
  agent?: AgentModel;

  agentReady: Promise<AgentModel>;
  protected agentDeferred: Deferred<AgentModel> = new Deferred<AgentModel>();

  constructor(@inject(ViewOption) option: ChatViewOption) {
    super(option);
    this.option = option;
    // setImmediate(this.initConversation);
  }

  override onViewMount() {
    this.initConversation();
    this.getAgent();
  }

  protected getAgent = async () => {
    this.agent = await this.agentManager.getOrCreate({ id: this.option['agentId'] });
    this.agent.fetchInfo();
    this.agentDeferred.resolve(this.agent);
  };
}
