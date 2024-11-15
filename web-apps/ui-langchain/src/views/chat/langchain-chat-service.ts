import type {
  ConversationOption,
  IChatEvent,
  IChatMessageItem,
} from '@difizen/magent-chat';
import { ChatService, ChatEvent } from '@difizen/magent-chat';
import { Fetcher } from '@difizen/magent-core';
import { inject, singleton, timeout } from '@difizen/mana-app';
import dayjs from 'dayjs';
import { EventSourceParserStream } from 'eventsource-parser/stream';

import type { APIMessage } from './protocol.js';

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
export class LangchainChatService extends ChatService {
  @inject(Fetcher) fetcher: Fetcher;

  override getConversation = async (
    opt: ConversationOption,
  ): Promise<ConversationOption | undefined> => {
    await timeout(500);
    return {
      id: opt.id || 'c-1',
      created: dayjs().toString(),
      modified: dayjs().toString(),
      messages: [
        {
          id: 'c-1-m-1',
          created: dayjs().toString(),
          modified: dayjs().toString(),
          messages: [
            {
              id: 'c-1-m-1-1',
              sender: { type: 'HUMAN', id: 'human' },
              content: 'hi',
            },

            {
              id: 'c-1-m-1-2',
              sender: { type: 'AI', id: 'ai' },
              content: '你好',
            },
          ],
        },
      ],
    };
  };

  override chat = async (option: any): Promise<IChatMessageItem[]> => {
    const { input, image } = option;
    const res = await this.fetcher.post<APIMessage>(`/api/v1/chat`, {
      conversation_id: 'conversation_2',
      input: input,
      image: image,
    });

    if (res.status === 200) {
      if (res.data.output) {
        return [
          {
            sender: { type: 'AI', id: 'openai' },
            content: res.data.output,
          },
        ];
      }
    }
    return [];
  };

  override chatStream = async (
    option: any,
    messgeCallback: (event: IChatMessageItem) => void,
    eventCallback: (event: IChatEvent) => void,
  ) => {
    const { input, image } = option;

    const url = `/api/v1/chat-stream`;
    const msg = {
      conversation_id: 'conversation_1',
      input: input,
      image: image,
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
        sender: { type: 'AI', id: 'langchain' },
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
