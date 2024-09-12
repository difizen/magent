import { ManaModule } from '@difizen/mana-app';

import { SessionOption } from './protocol.js';
import { SessionFactory } from './protocol.js';
import { SessionManager } from './session-manager.js';
import { SessionModel } from './session-model.js';

export const SessionModule = ManaModule.create().register(
  SessionModel,
  SessionManager,
  {
    token: SessionFactory,
    useFactory: (ctx) => {
      return (option: SessionOption) => {
        const child = ctx.container.createChild();
        child.register({ token: SessionOption, useValue: option });
        return child.get(SessionModel);
      };
    },
  },
);
