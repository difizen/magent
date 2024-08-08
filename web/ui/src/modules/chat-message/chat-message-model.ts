import type { Disposable, Event } from '@difizen/mana-app';
import { Emitter, Deferred } from '@difizen/mana-app';
import { inject, prop, transient } from '@difizen/mana-app';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { EventSourceParserStream } from 'eventsource-parser/stream';
import type { ParsedEvent } from 'eventsource-parser/stream';

import { AgentManager } from '../agent/agent-manager.js';
import type { AgentModel } from '../agent/agent-model.js';
import { AxiosClient } from '../axios-client/index.js';

import { AIChatMessageItem } from './ai-message-item.js';
import type { ChatMessageItem } from './chat-message-item.js';
import type {
  APIMessage,
  ChainItem,
  ChatEventChunk,
  ChatEventResult,
  ChatEventStep,
  ChatTokenUsage,
  MessageCreate,
  MessageOption,
} from './protocol.js';
import { AnswerState } from './protocol.js';
import { ChatMessageItemFactory } from './protocol.js';
import { ChatMessageType } from './protocol.js';
import { ChatMessageOption } from './protocol.js';

@transient()
export class ChatMessageModel implements Disposable {
  protected chatMessageItemFactory: ChatMessageItemFactory;
  protected axios: AxiosClient;
  protected agentManager: AgentManager;
  option: ChatMessageOption;

  id?: number;
  agentId: string;
  sessionId: string;

  @prop()
  agent?: AgentModel;

  @prop()
  messages: ChatMessageItem[] = [];
  @prop()
  created?: Dayjs;

  @prop()
  modified?: Dayjs;

  @prop()
  sending?: boolean = false;

  @prop()
  responseTime?: number;

  @prop()
  tokenUsage?: ChatTokenUsage;

  @prop()
  invocationChain?: ChainItem[];

  @prop()
  startTime?: Dayjs;

  @prop()
  endTime?: Dayjs;

  disposed = false;
  onDispose: Event<void>;
  protected onDisposeEmitter = new Emitter<void>();

  onMessageItem: Event<ChatMessageItem>;
  protected onMessageItemEmitter = new Emitter<ChatMessageItem>();

  agentReady: Promise<AgentModel>;
  protected agentDeferred: Deferred<AgentModel> = new Deferred<AgentModel>();

  constructor(
    @inject(ChatMessageOption) option: ChatMessageOption,
    @inject(AxiosClient) axios: AxiosClient,
    @inject(ChatMessageItemFactory) chatMessageItemFactory: ChatMessageItemFactory,
    @inject(AgentManager) agentManager: AgentManager,
  ) {
    this.option = option;
    this.agentReady = this.agentDeferred.promise;
    this.axios = axios;
    this.onDispose = this.onDisposeEmitter.event;
    this.onMessageItem = this.onMessageItemEmitter.event;
    this.chatMessageItemFactory = chatMessageItemFactory;
    this.agentManager = agentManager;
    if (ChatMessageType.isCreate(option)) {
      this.send(option);
    }
    if (ChatMessageType.isMessageOption(option)) {
      this.updateMeta(option);
    }
  }

  protected getAgent = async (id: string) => {
    const agent = await this.agentManager.getOrCreateAgent({ id });
    this.agent = agent;
    this.agent.fetchInfo();
    this.agentDeferred.resolve(agent);
  };

  dispose = (): void => {
    this.disposed = true;
    this.onDisposeEmitter.fire();
  };

  protected doUpdateMessages = async (option: MessageOption) => {
    let agent = this.agent;
    if (!agent) {
      agent = await this.agentReady;
    }
    await agent.ready;
    if (option.messages && option.messages.length > 0) {
      const messages = option.messages.map((item) =>
        this.chatMessageItemFactory({
          content: item.content,
          senderType: item.senderType,
          created: item.senderType === 'AI' ? option.modified : option.created,
          planner: agent!.planner?.id,
          agentId: this.agentId,
        }),
      );
      this.messages = messages;
      this.onMessageItemEmitter.fire(messages[messages.length - 1]);
    }
  };
  updateMeta = (option: MessageOption) => {
    this.id = option.id || dayjs().unix();
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
  doChat = async (option: MessageCreate) => {
    const { agentId, sessionId, input } = option;
    const res = await this.axios.post<APIMessage>(
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
      this.id = data.message_id;
      this.created = dayjs(data.gmt_created);
      this.modified = dayjs(data.gmt_modified);
      if (res.data.output) {
        const ai = this.chatMessageItemFactory({
          senderType: 'AI',
          content: res.data.output,
          planner: this.agent?.planner?.id,
          agentId: this.agentId,
        });
        this.messages.push(ai);
        this.onMessageItemEmitter.fire(ai);
      }
    }
  };

  protected handleChatEvent = (e: ParsedEvent | undefined, ai: AIChatMessageItem) => {
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
        this.tokenUsage = result.token_usage;
        this.responseTime = result.response_time;
        this.startTime = dayjs(result.start_time);
        this.endTime = dayjs(result.end_time);
        this.onMessageItemEmitter.fire(ai);
        ai.handleResult(e);
      }

      ai.handleEventData(e, data);
      this.onMessageItemEmitter.fire(ai);
    } catch (e) {
      console.warn('[chat] recerved server send event', event);
      console.error(e);
    }
  };

  doStreamChat = async (option: MessageCreate) => {
    const { agentId, sessionId, input } = option;

    const url = `/api/v1/agents/${option.agentId}/stream-chat`;
    const msg = {
      agent_id: agentId,
      session_id: sessionId,
      input: input,
    };
    const res = await this.axios.post<ReadableStream<Uint8Array>>(url, msg, {
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
      const ai = this.chatMessageItemFactory({
        senderType: 'AI',
        content: '',
        planner: this.agent?.planner?.id,
        agentId: this.agentId,
      });
      ai.state = AnswerState.RECEIVING;
      this.messages.push(ai);
      this.onMessageItemEmitter.fire(ai);
      if (ai instanceof AIChatMessageItem) {
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

  send = async (option: MessageCreate) => {
    const { input, stream = true } = option;
    this.sending = true;

    const human = this.chatMessageItemFactory({
      senderType: 'HUMAN',
      content: input,
      planner: this.agent?.planner?.id,
      agentId: this.agentId,
    });
    const opt: MessageOption = {
      ...option,
      messages: [human],
    };

    this.updateMeta(opt);
    this.startTime = dayjs();
    if (!stream) {
      await this.doChat(option);
    } else {
      await this.doStreamChat(option);
    }
    this.sending = false;
  };
}
