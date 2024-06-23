import { inject, singleton } from '@difizen/mana-app';

import { AxiosClient } from '../axios-client/index.js';
import { UserManager } from '../user/user-manager.js';

import type { Chat } from './chat.js';
import { ChatFactory } from './protocol.js';

@singleton()
export class ChatManager {
  @inject(ChatFactory) chatFactory: ChatFactory;
  @inject(UserManager) userManager: UserManager;
  @inject(AxiosClient) axios: AxiosClient;

  getBotDebugChat = async (botId: string): Promise<Chat> => {
    const user = await this.userManager.currentReady;
    const chat = await this.chatFactory({
      botId: botId,
      userId: user.id,
    });
    return chat;
  };
}
