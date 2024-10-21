import type { IChatMessageItem } from '@difizen/magent-chat';

export interface LibroChatMessageItemOption extends IChatMessageItem {
  chat_key: string;
}
