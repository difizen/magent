import { AutoFactoryOption } from '@difizen/magent-core';
import { inject, prop } from '@difizen/mana-app';
import type { Dayjs } from 'dayjs';

import type { IChatMessage, BaseChatMessageItemModel } from './protocol.js';

export class DefaultChatMessageModel {
  @prop()
  messages: BaseChatMessageItemModel[];

  @prop()
  created?: Dayjs;

  @prop()
  modified?: Dayjs;

  id?: number;
  token?: any;

  constructor(@inject(AutoFactoryOption) option: IChatMessage) {
    //
  }
}
