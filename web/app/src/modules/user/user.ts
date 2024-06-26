import { Deferred, inject, prop, transient } from '@difizen/mana-app';
import axios from 'axios';

import { defaultSuperUserEmal } from '../../constant/default.js';

import { UserMeta, UserMetaOption } from './user-protocol.js';

/**
 * User
 * automatic initialization.
 */
@transient()
export class User implements UserMeta {
  /**
   * 用户唯一标识
   */
  @prop()
  id: string;
  /**
   * 花名
   */
  @prop()
  name: string;
  /**
   * 邮箱
   */
  @prop()
  email: string;
  /**
   * 头像
   */
  @prop()
  avatar?: string;

  ready: Promise<User>;
  protected readyDeferred: Deferred<User> = new Deferred<User>();
  protected readonly meta: UserMeta;

  constructor(@inject(UserMetaOption) meta: UserMeta) {
    this.meta = meta;
    this.ready = this.readyDeferred.promise;
    this.id = this.meta.id;
    if (UserMeta.isFull(this.meta)) {
      this.fromMeta(this.meta);
    } else {
      this.fetchUserInfo();
    }
  }

  protected fromMeta(meta: UserMeta) {
    this.id = meta.id;
    this.name = meta.name!;
    this.email = meta.email!;
    this.avatar = meta.avatar!;
    this.readyDeferred.resolve(this);
  }
  async fetchUserInfo() {
    const superAdminEmail = defaultSuperUserEmal;
    const res = await axios.get<UserMeta>(`api/v1/accounts/email/${superAdminEmail}`);
    if (res.status === 200 && UserMeta.is(res.data)) {
      this.fromMeta(res.data);
    }
  }
}
