import type { IChatMessageItem } from './protocol.js';

export class DefaultChatMessageItemModel implements IChatMessageItem {
  id?: number;
  senderId: string;
  content: string;
  created?: string;
  modified?: string;
}
