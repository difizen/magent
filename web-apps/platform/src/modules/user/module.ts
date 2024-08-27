import { ManaModule } from '@difizen/mana-app';

import { UserManager } from './user-manager.js';
import type { UserMeta } from './user-protocol.js';
import { UserFactory, UserMetaOption } from './user-protocol.js';
import { User } from './user.js';

export const UserModule = ManaModule.create()
  .register(User, UserManager)
  .register({
    token: UserFactory,
    useFactory: (ctx) => {
      return (userMeta: UserMeta) => {
        const child = ctx.container.createChild();
        child.register({ token: UserMetaOption, useValue: userMeta });
        return child.get(User);
      };
    },
  });
