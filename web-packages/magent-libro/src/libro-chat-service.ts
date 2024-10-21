import type {
  ConversationOption,
  IChatEvent,
  IChatMessageItem,
} from '@difizen/magent-chat';
import { ChatEvent } from '@difizen/magent-chat';
import { ChatService } from '@difizen/magent-chat';
import { Fetcher } from '@difizen/magent-core';
import { inject, singleton } from '@difizen/mana-app';
import dayjs from 'dayjs';
import { EventSourceParserStream } from 'eventsource-parser/stream';

import type { LibroChatMessageItemOption } from './protocol.js';

function stringToReadableStream(inputString: string) {
  // Convert the string into a Uint8Array
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(inputString);

  // Create a new ReadableStream
  const readableStream = new ReadableStream({
    start(controller) {
      // Enqueue the Uint8Array into the stream
      controller.enqueue(uint8Array);
      // Close the stream
      controller.close();
    },
  });

  return readableStream;
}

@singleton()
export class LibroChatService extends ChatService {
  @inject(Fetcher) fetcher: Fetcher;
  override getConversation = async (
    opt: ConversationOption,
  ): Promise<ConversationOption | undefined> => {
    return {
      id: opt.id || 'c-1',
      chat_key: 'LLM:gpt4',
      created: dayjs().toString(),
      modified: dayjs().toString(),
      messages: [],
    };
  };

  override chat = async (
    option: LibroChatMessageItemOption,
  ): Promise<IChatMessageItem[]> => {
    const { chat_key, content } = option;
    const res = await this.fetcher.post<any>(`/libro/api/chat`, {
      chat_key: chat_key,
      prompt: content,
    });

    if (res.status === 200) {
      if (res.data.output) {
        return [
          {
            sender: { type: 'AI', id: chat_key },
            content: res.data.output,
          },
        ];
      }
    }
    return [];
  };
  override chatStream = async (
    option: LibroChatMessageItemOption,
    messgeCallback: (event: IChatMessageItem) => void,
    eventCallback: (event: IChatEvent) => void,
  ) => {
    const { chat_key, content } = option;

    const url = `/libro/api/chatstream`;
    const msg = {
      chat_key: chat_key,
      prompt: content,
    };
    const res = await this.fetcher.post<ReadableStream<Uint8Array>>(url, msg, {
      headers: {
        Accept: 'text/event-stream',
      },
      responseType: 'stream',
      adapter: 'fetch',
    });
    if (res.status === 200) {
      let reader;
      if (typeof res.data === 'string') {
        reader = stringToReadableStream(res.data)
          .pipeThrough(new TextDecoderStream())
          .pipeThrough(new EventSourceParserStream())
          .getReader();
      } else {
        const stream = res.data;
        reader = stream
          .pipeThrough(new TextDecoderStream())
          .pipeThrough(new EventSourceParserStream())
          .getReader();
      }

      messgeCallback({
        sender: { type: 'AI', id: chat_key },
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
        const data = JSON.parse(value.data);
        const event = ChatEvent.format(value.event || 'chunk', data);
        eventCallback(event);
      }
      return;
    }
  };
}
