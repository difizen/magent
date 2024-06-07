import { Deferred, inject, prop, singleton } from '@difizen/mana-app';

import { UserFactory } from './user-protocol.js';
import type { UserMeta } from './user-protocol.js';
import type { User } from './user.js';

@singleton()
export class UserManager {
  @inject(UserFactory) factory: UserFactory;

  @prop()
  current?: User;
  protected userMap = new Map<string, User>();

  protected initializedDefer = new Deferred<void>();

  initializedResolve() {
    this.initializedDefer.resolve();
  }

  get initialized() {
    return this.initializedDefer.promise;
  }

  setCurrent(userMeta: UserMeta) {
    const user = this.getOrCreate(userMeta);
    this.current = user;
  }

  getOrCreate(userMeta: UserMeta): User {
    const exist = this.userMap.get(userMeta.id);
    if (exist) {
      return exist;
    }
    const user = this.factory(userMeta);
    this.userMap.set(user.id, user);
    return user;
  }
}
