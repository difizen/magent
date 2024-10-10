import { autoFactory, AutoFactoryOption } from '@difizen/magent-core';
import { inject, prop } from '@difizen/mana-app';

import type { BaseConversationModel } from './protocol.js';

@autoFactory()
export class ConversationMananger {
  protected option: any;

  @prop()
  list: BaseConversationModel[];

  constructor(@inject(AutoFactoryOption) option: any) {
    this.option = option;
  }
}
