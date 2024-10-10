import type { ConversationOption } from '@difizen/magent-chat';
import { ChatService } from '@difizen/magent-chat';
import { singleton, timeout } from '@difizen/mana-app';
import dayjs from 'dayjs';

@singleton()
export class MockChatService extends ChatService {
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
}
