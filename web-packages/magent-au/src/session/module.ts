import {
  ChatBaseModule,
  ConversationManager,
  DefaultConversationModel,
} from '@difizen/magent-chat';
import { toAutoFactory } from '@difizen/magent-core';
import { ManaModule, Syringe } from '@difizen/mana-app';

import { SessionManager } from './session-manager.js';
import { SessionModel } from './session-model.js';

export const SessionModule = ManaModule.create('au-session')
  .register(
    // {
    //   token: ConversationManager,
    //   useClass: SessionManager,
    //   lifecycle: Syringe.Lifecycle.singleton,
    // },
    SessionModel,
    // {
    //   token: toAutoFactory(DefaultConversationModel),
    //   useDynamic: (ctx) => ctx.container.get(toAutoFactory(SessionModel)),
    // },
    {
      token: DefaultConversationModel,
      useClass: SessionModel,
    },
    SessionManager,

    {
      token: ConversationManager,
      useDynamic: (ctx) => {
        return ctx.container.get(SessionManager);
      },
      lifecycle: Syringe.Lifecycle.singleton,
    },
  )
  .dependOn(ChatBaseModule);
