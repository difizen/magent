import { inject, singleton } from '@difizen/mana-app';

import { AxiosClient } from '../axios-client/index.js';

import type { ChatMessage, ChatMessageOption } from './protocol.js';
import { ChatMessageFactory } from './protocol.js';

@singleton()
export class ChatMessageManager {
  @inject(ChatMessageFactory) chatMessageFactory: ChatMessageFactory;
  @inject(AxiosClient) axios: AxiosClient;

  getOrCreateMessage = (option: ChatMessageOption): ChatMessage => {
    const msg = this.chatMessageFactory(option);
    return msg;
  };
}
