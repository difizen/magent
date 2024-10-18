import type {
  ChatMessageItemOption,
  ConversationOption,
  IChatEvent,
} from '@difizen/magent-chat';
import type { IChatMessageItem } from '@difizen/magent-chat';
import { ChatService } from '@difizen/magent-chat';
import { Fetcher } from '@difizen/magent-core';
import { inject, singleton } from '@difizen/mana-app';
import { EventSourceParserStream } from 'eventsource-parser/stream';

import type { APISession, SessionOption } from '../session/protocol.js';
import { toSessionOption } from '../session/protocol.js';

import type { APIMessage, AUMessageCreate } from './protocol.js';

@singleton()
export class AUChatService extends ChatService {
  @inject(Fetcher) fetcher: Fetcher;
  override chat = async (option: AUMessageCreate): Promise<IChatMessageItem[]> => {
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
      if (res.data.output) {
        return [
          {
            sender: { type: 'AI', id: agentId },
            content: res.data.output,
          },
        ];
      }
    }
    return [];
  };
  override chatStream = async (
    option: AUMessageCreate,
    messgeCallback: (event: IChatMessageItem) => void,
    eventCallback: (event: IChatEvent) => void,
  ) => {
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
      const stream = res.data;
      const reader = stream
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new EventSourceParserStream())
        .getReader();

      messgeCallback({
        sender: { type: 'AI', id: agentId },
        content: '',
      });
      let alreayDone = false;
      while (!alreayDone) {
        const { value, done } = await reader.read();
        if (done) {
          alreayDone = true;
          eventCallback({
            type: 'done',
          });

          break;
        }
        eventCallback(value);
      }
      return;
    }
  };

  override getConversationMessages = async (
    conversation: ConversationOption,
  ): Promise<ChatMessageItemOption[]> => {
    return [];
  };

  override getConversations = async (opt: {
    agentId: string;
  }): Promise<SessionOption[]> => {
    const res = await this.fetcher.get<APISession[]>(`/api/v1/sessions`, {
      agent_id: opt.agentId,
    });
    if (res.status !== 200) {
      return [];
    }
    return res.data.map((item) => toSessionOption(item));
  };

  override getConversation = async (
    opt: ConversationOption,
  ): Promise<ConversationOption | undefined> => {
    return undefined;
  };

  override createConversation = async (option: {
    agentId: string;
  }): Promise<SessionOption> => {
    const res = await this.fetcher.post<APISession>(`/api/v1/sessions`, {
      agent_id: option.agentId,
    });
    if (res.status !== 200) {
      throw new Error('Create session failed');
    }
    return toSessionOption(res.data);
  };

  override deleteConversation = async (opt: ConversationOption): Promise<boolean> => {
    const res = await this.fetcher.delete<APISession>(`/api/v1/sessions/${opt.id}`);
    if (res.status !== 200) {
      return false;
    }
    return true;
  };
}
