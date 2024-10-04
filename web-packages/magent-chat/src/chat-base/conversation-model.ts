import type { IConversation, BaseChatMessageModel } from './protocol.js';

export class DefaultConversationModel implements IConversation {
  id?: string;
  created?: string;
  modified?: string;
  messages?: BaseChatMessageModel[];

  protected _title: string;
  get title(): string {
    return this._title;
  }
  set title(v: string) {
    this._title = v;
  }
}
