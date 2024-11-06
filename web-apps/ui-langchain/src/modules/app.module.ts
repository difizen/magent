import { ChatModule } from '@difizen/magent-chat';
import { ManaModule } from '@difizen/mana-app';

import { LangchainChatViewModule } from '@/views/chat/module.js';

export const AppBaseModule = new ManaModule().dependOn(
  ChatModule,
  LangchainChatViewModule,
);

export default AppBaseModule;
