import { inject, singleton } from '@difizen/mana-app';

import { AxiosClient } from '../axios-client/protocol.js';

import type { ChatMessageModel, ChatMessageOption } from './protocol.js';
import { ChatMessageFactory } from './protocol.js';

@singleton()
export class ChatMessageManager {
  @inject(ChatMessageFactory) chatMessageFactory: ChatMessageFactory;
  @inject(AxiosClient) axios: AxiosClient;

  createMessage = (option: ChatMessageOption): ChatMessageModel => {
    const msg = this.chatMessageFactory(option);
    return msg;
  };
}
