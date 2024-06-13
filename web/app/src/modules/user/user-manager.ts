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

  protected initializedDefer = new Deferred<User>();

  get initialized(): Promise<User> {
    return this.initializedDefer.promise;
  }

  get currentReady(): Promise<User> {
    return this.initialized.then((user) => user.ready);
  }

  setCurrent(userMeta: UserMeta) {
    const user = this.getOrCreate(userMeta);
    this.current = user;
  }

  async initialize() {
    this.current = await this.getOrCreate({ id: '1' });
    this.initializedDefer.resolve(this.current);
  }

  getOrCreate(userMeta: UserMeta): User {
    if (userMeta.id) {
      const exist = this.userMap.get(userMeta.id);
      if (exist) {
        return exist;
      }
    }
    const user = this.factory(userMeta);
    if (!userMeta.id) {
      user.ready
        .then(() => {
          this.userMap.set(user.id, user);
          return;
        })
        .catch(console.error);
    }
    return user;
  }
}
