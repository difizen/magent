import { FetcherModule } from '@difizen/magent-core';
import { ManaModule } from '@difizen/mana-app';

import { ChatBaseModule } from './chat-base/module.js';
import { ChatViewModule } from './chat-view/module.js';

export const ChatModule = ManaModule.create('magent-chat').dependOn(
  ChatBaseModule,
  ChatViewModule,
  FetcherModule,
);
