import type { BaseChatMessageItemModel } from '@difizen/magent-chat';
import { DefaultChatMessageModel, ChatMessageItemManager } from '@difizen/magent-chat';
import { autoFactory, AutoFactoryOption, Fetcher } from '@difizen/magent-core';
import type { Event } from '@difizen/mana-app';
import { Emitter, Deferred } from '@difizen/mana-app';
import { inject, prop } from '@difizen/mana-app';
import dayjs from 'dayjs';
import { EventSourceParserStream } from 'eventsource-parser/stream';
import type { ParsedEvent } from 'eventsource-parser/stream';

import { AgentManager } from '../agent/agent-manager.js';
import type { AgentModel } from '../agent/agent-model.js';

import { AUAgentChatMessageItem } from './ai-message-item.js';
import { AnswerState } from './protocol.js';
import { AUChatMessageType } from './protocol.js';
import type {
  APIMessage,
  ChainItem,
  ChatEventResult,
  AUMessageOption,
  AUMessageCreate,
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
  sending?: boolean = false;

  @prop()
  invocationChain?: ChainItem[];

  disposed = false;
  onDispose: Event<void>;
  protected onDisposeEmitter = new Emitter<void>();

  onMessageItem: Event<BaseChatMessageItemModel>;
  protected onMessageItemEmitter = new Emitter<BaseChatMessageItemModel>();

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
    this.onDispose = this.onDisposeEmitter.event;
    this.onMessageItem = this.onMessageItemEmitter.event;
    this.agentManager = agentManager;
    if (AUChatMessageType.isCreate(option)) {
      this.send(option);
    }
    if (AUChatMessageType.isMessageOption(option)) {
      this.updateMeta(option);
    }
  }

  protected getAgent = async (id: string) => {
    const agent = await this.agentManager.getOrCreate({ id });
    this.agent = agent;
    this.agent.fetchInfo();
    this.agentDeferred.resolve(agent);
  };

  dispose = (): void => {
    this.disposed = true;
    this.onDisposeEmitter.fire();
  };

  protected doUpdateMessages = async (option: AUMessageOption) => {
    let agent = this.agent;
    if (!agent) {
      agent = await this.agentReady;
    }
    await agent.ready;
    if (option.messages && option.messages.length > 0) {
      const messages = option.messages.map((item) =>
        this.itemManager.createChatMessageItem({
          parent: this,
          content: item.content,
          sender: item.sender,
          created: item.sender.type === 'AI' ? option.modified : option.created,
          planner: agent!.planner?.id,
          agentId: this.agentId,
        }),
      );
      this.messages = messages;
      this.onMessageItemEmitter.fire(messages[messages.length - 1]);
    }
  };
  updateMeta = (option: AUMessageOption) => {
    this.id = option.id || dayjs().unix().toString();
    this.agentId = option.agentId;
    this.getAgent(this.agentId);
    this.sessionId = option.sessionId;
    if (option.created) {
      this.created = dayjs(option.created);
    }
    if (option.modified) {
      this.modified = dayjs(option.modified);
    }
    this.doUpdateMessages(option);
  };
  doChat = async (option: AUMessageCreate) => {
    const { agentId, sessionId, input } = option;
    const res = await this.fetcher.post<APIMessage>(
      `/api/v1/agents/${option.agentId}/chat`,
      {
        agent_id: agentId,
        session_id: sessionId,
        input: input,
      },
    );

    if (res.status === 200) {
      this.sending = false;
      const data = res.data;
      this.id = data.message_id.toString();
      this.created = dayjs(data.gmt_created);
      this.modified = dayjs(data.gmt_modified);
      if (res.data.output) {
        const ai = this.itemManager.createChatMessageItem({
          parent: this,
          sender: { type: 'AI' },
          content: res.data.output,
          planner: this.agent?.planner?.id,
          agentId: this.agentId,
        });
        this.messages.push(ai);
        this.onMessageItemEmitter.fire(ai);
      }
    }
  };

  protected handleChatEvent = (
    e: ParsedEvent | undefined,
    ai: AUAgentChatMessageItem,
  ) => {
    if (!e) {
      return;
    }
    try {
      const data = JSON.parse(e.data);
      // if (e.event === 'message') {
      //   const newMessageModel: ChatMessageModel = JSON.parse(e.data);
      //   const message = this.getOrCreateMessage(newMessageModel);
      //   this.messages = [...this.messages, message];
      //   setImmediate(() => this.scrollToBottom(true, false));
      // }

      if (e.event === 'result') {
        const result: ChatEventResult = data;
        this.invocationChain = result.invocation_chain;
        // this.tokenUsage = result.token_usage;
        // this.responseTime = result.response_time;
        // this.startTime = dayjs(result.start_time);
        // this.endTime = dayjs(result.end_time);
        this.onMessageItemEmitter.fire(ai);
      }

      ai.handleEventData(e, data);
      this.onMessageItemEmitter.fire(ai);
    } catch (e) {
      console.warn('[chat] recerved server send event', event);
      console.error(e);
    }
  };

  doStreamChat = async (option: AUMessageCreate) => {
    const { agentId, sessionId, input } = option;

    const url = `/api/v1/agents/${option.agentId}/stream-chat`;
    const msg = {
      agent_id: agentId,
      session_id: sessionId,
      input: input,
    };
    const res = await this.fetcher.post<ReadableStream<Uint8Array>>(url, msg, {
      headers: {
        Accept: 'text/event-stream',
      },
      responseType: 'stream',
      adapter: 'fetch',
    });
    if (res.status === 200) {
      this.sending = false;
      const stream = res.data;
      const reader = stream
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new EventSourceParserStream())
        .getReader();

      let alreayDone = false;
      const ai = this.itemManager.createChatMessageItem({
        parent: this,
        sender: { type: 'AI' },
        content: '',
        planner: this.agent?.planner?.id,
        agentId: this.agentId,
      });
      ai.state = AnswerState.RECEIVING;
      this.messages.push(ai);
      this.onMessageItemEmitter.fire(ai);
      if (ai instanceof AUAgentChatMessageItem) {
        while (!alreayDone) {
          const { value, done } = await reader.read();
          if (done) {
            alreayDone = true;
            break;
          }
          this.handleChatEvent(value, ai);
        }
      }
      ai.state = AnswerState.SUCCESS;
      return;
    }
  };

  send = async (option: AUMessageCreate) => {
    const { input, stream = true } = option;
    this.sending = true;

    const human = this.itemManager.createChatMessageItem({
      parent: this,
      sender: { type: 'HUMAN' },
      content: input,
      planner: this.agent?.planner?.id,
      agentId: this.agentId,
    });
    const opt: AUMessageOption = {
      ...option,
      messages: [human.option],
    };

    this.updateMeta(opt);
    // this.startTime = dayjs();
    if (!stream) {
      await this.doChat(option);
    } else {
      await this.doStreamChat(option);
    }
    this.sending = false;
  };
}
