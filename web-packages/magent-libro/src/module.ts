import { ChatService, ChatModule } from '@difizen/magent-chat';
import { ManaModule } from '@difizen/mana-app';

import { LibroChatService } from './libro-chat-service.js';

export const LibroChatModule = new ManaModule()
  .register(LibroChatService)
  .register({
    token: ChatService,
    useDynamic: (ctx) => ctx.container.get(LibroChatService),
  })
  .dependOn(ChatModule);
