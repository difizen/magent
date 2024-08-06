import type { Disposable, Event } from '@difizen/mana-app';
import { Emitter } from '@difizen/mana-app';
import { inject, prop, transient } from '@difizen/mana-app';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { EventSourceParserStream } from 'eventsource-parser/stream';
import type { ParsedEvent } from 'eventsource-parser/stream';

import { AxiosClient } from '../axios-client/index.js';

import type { ChatMessageItem } from './chat-message-item.js';
import { AIChatMessageItem } from './chat-message-item.js';
import type { APIMessage, MessageCreate, MessageOption } from './protocol.js';
import { AnswerState } from './protocol.js';
import { ChatMessageItemFactory } from './protocol.js';
import { ChatMessageType } from './protocol.js';
import { ChatMessageOption } from './protocol.js';

@transient()
export class ChatMessageModel implements Disposable {
  protected chatMessageItemFactory: ChatMessageItemFactory;
  protected axios: AxiosClient;
  option: ChatMessageOption;

  id?: number;
  agentId: string;
  sessionId: string;

  @prop()
  messages: ChatMessageItem[] = [];
  @prop()
  created?: Dayjs;

  @prop()
  modified?: Dayjs;

  @prop()
  complete?: boolean = true;

  @prop()
  sending?: boolean = false;

  disposed = false;
  onDispose: Event<void>;
  protected onDisposeEmitter = new Emitter<void>();

  onMessageItem: Event<ChatMessageItem>;
  protected onMessageItemEmitter = new Emitter<ChatMessageItem>();

  constructor(
    @inject(ChatMessageOption) option: ChatMessageOption,
    @inject(AxiosClient) axios: AxiosClient,
    @inject(ChatMessageItemFactory) chatMessageItemFactory: ChatMessageItemFactory,
  ) {
    this.option = option;
    this.axios = axios;
    this.onDispose = this.onDisposeEmitter.event;
    this.onMessageItem = this.onMessageItemEmitter.event;
    this.chatMessageItemFactory = chatMessageItemFactory;
    if (ChatMessageType.isCreate(option)) {
      this.send(option);
    }
    if (ChatMessageType.isMessageOption(option)) {
      this.updateMeta(option);
    }
  }

  dispose = (): void => {
    this.disposed = true;
    this.onDisposeEmitter.fire();
  };

  updateMeta = (option: MessageOption) => {
    this.id = option.id;
    this.agentId = option.agentId;
    this.sessionId = option.sessionId;
    if (option.messages && option.messages.length > 0) {
      const messages = option.messages.map((item) =>
        this.chatMessageItemFactory({
          ...item,
          created: item.senderType === 'AI' ? option.modified : option.created,
        }),
      );
      this.messages = messages;
      this.onMessageItemEmitter.fire(messages[messages.length - 1]);
    }
    if (option.created) {
      this.created = dayjs(option.created);
    }
    if (option.modified) {
      this.modified = dayjs(option.modified);
    }
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
      const data = res.data;
      this.id = data.message_id;
      this.created = dayjs(data.gmt_created);
      this.modified = dayjs(data.gmt_modified);
      if (res.data.output) {
        const ai = this.chatMessageItemFactory({
          senderType: 'AI',
          content: res.data.output,
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
      // if (e.event === 'message') {
      //   const newMessageModel: ChatMessageModel = JSON.parse(e.data);
      //   const message = this.getOrCreateMessage(newMessageModel);
      //   this.messages = [...this.messages, message];
      //   setImmediate(() => this.scrollToBottom(true, false));
      // }

      if (e.event === 'chunk') {
        const chunk = JSON.parse(e.data);
        ai.appendChunk(chunk);
        this.onMessageItemEmitter.fire(ai);
      }
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
      const stream = res.data;
      const reader = stream
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new EventSourceParserStream())
        .getReader();

      let alreayDone = false;
      const ai = this.chatMessageItemFactory({
        senderType: 'AI',
        content: '',
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
    });
    const opt: MessageOption = {
      ...option,
      messages: [human],
    };

    this.updateMeta(opt);

    if (!stream) {
      await this.doChat(option);
    } else {
      await this.doStreamChat(option);
    }
    this.sending = false;
  };
}
