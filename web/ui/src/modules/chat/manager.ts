import { inject, singleton } from '@difizen/mana-app';

import { AxiosClient } from '../axios-client/index.js';

import type { Chat } from './chat.js';
import { ChatFactory } from './protocol.js';

@singleton()
export class ChatManager {
  @inject(ChatFactory) chatFactory: ChatFactory;
  @inject(AxiosClient) axios: AxiosClient;

  getBotDebugChat = async (botId: number): Promise<Chat> => {
    const chat = await this.chatFactory({
      botId: botId,
      userId: 1,
    });
    return chat;
  };
}
