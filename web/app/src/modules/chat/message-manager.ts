import { inject, singleton } from '@difizen/mana-app';

import { AxiosClient } from '../axios-client/index.js';
// import { UserManager } from '../user/user-manager.js';

import type { Chat } from './chat.js';
import type { ChatMessage, ChatMessageOption } from './protocol.js';
import { ChatMessageFactory } from './protocol.js';

@singleton()
export class ChatMessageManager {
  @inject(ChatMessageFactory) chatMessageFactory: ChatMessageFactory;
  // @inject(UserManager) userManager: UserManager;
  @inject(AxiosClient) axios: AxiosClient;

  getOrCreateMessage = (option: ChatMessageOption): ChatMessage => {
    // const user = await this.userManager.currentReady;
    const msg = this.chatMessageFactory(option);
    return msg;
  };
}
