import type {
  BaseChatMessageItemModel,
  ChatMessageOption,
  IChatEvent,
  IChatMessageItem,
} from '@difizen/magent-chat';
import { DefaultChatMessageModel, ChatMessageItemManager } from '@difizen/magent-chat';
import { autoFactory, AutoFactoryOption, Fetcher } from '@difizen/magent-core';
import { Deferred } from '@difizen/mana-app';
import { inject, prop } from '@difizen/mana-app';

import { AgentManager } from '../agent/agent-manager.js';
import type { AgentModel } from '../agent/agent-model.js';

import { AUChatEvent } from './protocol.js';
import { AUChatMessageType } from './protocol.js';
import type {
  ChainItem,
  ChatEventResult,
  AUMessageOption,
  AUChatMessageItemOption,
} from './protocol.js';
import type { AUChatMessageOption } from './protocol.js';

@autoFactory()
export class AUChatMessageModel extends DefaultChatMessageModel {
  protected fetcher: Fetcher;
  protected agentManager: AgentManager;
  override option: AUChatMessageOption;

  agentId: string;
  sessionId: string;

  @prop()
  agent?: AgentModel;

  @prop()
  messages: BaseChatMessageItemModel[] = [];

  @prop()
  invocationChain?: ChainItem[];

  agentReady: Promise<AgentModel>;
  protected agentDeferred: Deferred<AgentModel> = new Deferred<AgentModel>();

  constructor(
    @inject(AutoFactoryOption) option: AUChatMessageOption,
    @inject(ChatMessageItemManager) itemManager: ChatMessageItemManager,
    @inject(Fetcher) fetcher: Fetcher,
    @inject(AgentManager) agentManager: AgentManager,
  ) {
    super(option, itemManager);
    this.option = option;
    this.agentReady = this.agentDeferred.promise;
    this.fetcher = fetcher;
    this.agentManager = agentManager;
  }

  protected override initMessageItems = <T extends ChatMessageOption>(option: T) => {
    if (AUChatMessageType.isCreate(option)) {
      this.send(option);
    }
    if (AUChatMessageType.isMessageOption(option)) {
      this.updateMeta(option);
    }
  };

  protected getAgent = async (id: string) => {
    const agent = await this.agentManager.getOrCreate({ id });
    this.agent = agent;
    this.agent.fetchInfo();
    this.agentDeferred.resolve(agent);
  };

  protected doUpdateMessages = async (option: AUMessageOption) => {
    let agent = this.agent;
    if (!agent) {
      agent = await this.agentReady;
    }
    await agent.ready;
    if (option.messages && option.messages.length > 0) {
      const messages = option.messages.map((item) =>
        this.itemManager.createChatMessageItem(
          this.toChatMessageItemOption({
            content: item.content,
            sender: item.sender,
            created: item.sender.type === 'AI' ? option.modified : option.created,
          }),
        ),
      );
      this.messages = messages;
      this.onMessageItemEmitter.fire(messages[messages.length - 1]);
    }
  };

  override updateMeta(option: ChatMessageOption) {
    if ('agentId' in option) {
      this.agentId = option['agentId'];
    }
    this.parent = option.parent;
    if (option.modified) {
      this.updateSummary({ end_time: option.modified });
    }
    super.updateMeta(option);
    this.getAgent(this.agentId);
  }

  override handleChatEvent(event: IChatEvent, item: BaseChatMessageItemModel) {
    if (AUChatEvent.isResult(event)) {
      const result: ChatEventResult = event;
      this.invocationChain = result.invocation_chain;
      this.updateSummary({
        total_tokens: event.token_usage.total_tokens,
        completion_tokens: event.token_usage.completion_tokens,
        prompt_tokens: event.token_usage.prompt_tokens,
        start_time: event.start_time,
        end_time: event.end_time,
        response_time: event.response_time,
      });
    }
    super.handleChatEvent(event, item);
  }

  override toChatMessageItemOption(item: IChatMessageItem): AUChatMessageItemOption {
    return {
      parent: this,
      content: item.content,
      sender: item.sender,
      agentId: this.agentId,
      planner: this.agent?.planner?.id,
    };
  }

  protected override async send<T extends ChatMessageOption>(option: T) {
    if (!AUChatMessageType.isCreate(option)) {
      return;
    }
    super.send(option);
  }
}
