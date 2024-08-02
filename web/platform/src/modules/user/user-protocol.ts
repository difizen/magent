import type { User } from './user.js';

/**
 * Provide the initialization input for the User module.
 */
export const UserInitializeInfoProvider = Symbol('UserInitializeInfoProvider');
export interface UserInitializeInfoProvider {
  providerUserMeta: () => Promise<UserMeta>;
}

export const UserFactory = Symbol('UserFactory');
export type UserFactory = (meta: UserMeta) => User;

export const UserMeta = {
  is(data?: Record<string, any>): data is UserMeta {
    return !!(data && 'id' in data);
  },
  isFull(data?: Record<string, any>): boolean {
    return UserMeta.is(data) && 'email' in data && 'email' in data;
  },
};

export interface UserMeta {
  id: string;
  email?: string;
  name?: string;
  avatar?: string;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export const UserMetaOption = Symbol('UserMetaOption');
