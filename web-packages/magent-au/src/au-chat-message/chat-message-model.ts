import type {
  BaseChatMessageItemModel,
  ChatMessageOption,
  IChatEvent,
} from '@difizen/magent-chat';
import { DefaultChatMessageModel, ChatMessageItemManager } from '@difizen/magent-chat';
import { autoFactory, AutoFactoryOption, Fetcher } from '@difizen/magent-core';
import { Deferred } from '@difizen/mana-app';
import { inject, prop } from '@difizen/mana-app';
import dayjs from 'dayjs';
import { EventSourceParserStream } from 'eventsource-parser/stream';

import { AgentManager } from '../agent/agent-manager.js';
import type { AgentModel } from '../agent/agent-model.js';

import { AUAgentChatMessageItem } from './ai-message-item.js';
import { AnswerState, AUChatEvent } from './protocol.js';
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

  override updateMeta(option: ChatMessageOption) {
    super.updateMeta(option);
    if ('agentId' in option) {
      this.agentId = option['agentId'];
    }
    this.getAgent(this.agentId);
    this.parent = option.parent;
  }

  protected doChat = async (option: AUMessageCreate) => {
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

  protected handleChatEvent = (e: IChatEvent, ai: AUAgentChatMessageItem) => {
    if (!e) {
      return;
    }
    try {
      if (AUChatEvent.isResult(e)) {
        const result: ChatEventResult = e;
        this.invocationChain = result.invocation_chain;
        this.onMessageItemEmitter.fire(ai);
      }

      ai.handleEventData(e);
      this.onMessageItemEmitter.fire(ai);
    } catch (e) {
      console.warn('[chat] recerved server send event', event);
      console.error(e);
    }
  };

  protected doStreamChat = async (option: AUMessageCreate) => {
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
          const data = JSON.parse(value.data);
          const event = AUChatEvent.format(value.event || 'chunk', data);
          this.handleChatEvent(event, ai);
        }
      }
      ai.state = AnswerState.SUCCESS;
      return;
    }
  };

  protected send = async (option: AUMessageCreate) => {
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
