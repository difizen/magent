import { transient } from '@difizen/mana-app';

import type { ChatMessage } from './protocol.js';

@transient()
export class ChatTurn {
  id: string;
  messages: ChatMessage[] = [];

  constructor(id: string) {
    this.id = id;
  }

  addMessage = (msg: ChatMessage) => {
    this.messages.push(msg);
  };
}
