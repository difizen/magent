import { FetcherModule } from '@difizen/magent-core';
import { ManaModule } from '@difizen/mana-app';
import { l10n } from '@difizen/mana-l10n';

import { ChatBaseModule } from './chat-base/module.js';
import { ChatViewModule } from './chat-view/module.js';
import { magentChatLangBundles } from './lang/index.js';

export const ChatModule = ManaModule.create('magent-chat')
  .preload(() => {
    l10n.loadLangBundles(magentChatLangBundles);
    return Promise.resolve();
  })
  .dependOn(ChatBaseModule, ChatViewModule, FetcherModule);
