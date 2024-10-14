import { singleton } from '@difizen/mana-app';

import type { ChatMessageItemOption } from './chat-message-item-model.js';
import type {
  ConversationOption,
  IChatEvent,
  IChatMessageItem,
  IConversation,
} from './protocol.js';

@singleton()
export class ChatService {
  chat = async (msg: any): Promise<IChatMessageItem[]> => {
    throw new Error('Unimplemented');
  };
  chatStream = async (msg: any, callback: (event: IChatEvent) => void) => {
    //
  };

  getConversationMessages = async (
    conversation: ConversationOption,
  ): Promise<undefined | ChatMessageItemOption[]> => {
    return undefined;
  };

  getConversations = async (opt: any): Promise<undefined | ConversationOption[]> => {
    return undefined;
  };

  getConversation = async (
    opt: ConversationOption,
  ): Promise<ConversationOption | undefined> => {
    return undefined;
  };

  createConversation = async (
    opt: IConversation,
  ): Promise<ConversationOption | undefined> => {
    return undefined;
  };

  deleteConversation = async (opt: ConversationOption): Promise<boolean> => {
    return true;
  };
}