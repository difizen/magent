import { prop, transient } from '@difizen/mana-app';

import { AsyncModel } from '../async-model.js';

import type { ComponentMeta } from './protocol.js';

@transient()
export abstract class ComponentModel<T, O extends ComponentMeta> extends AsyncModel<
  T,
  O
> {
  id: string;

  @prop()
  avatar?: string;

  @prop()
  nickname: string;

  @prop()
  description: string;

  get name(): string {
    return this.nickname;
  }
  set name(v: string) {
    this.nickname = v;
  }

  protected override fromMeta(option: O): void {
    this.id = option.id;
    if (option.nickname) {
      this.nickname = option.nickname;
    }
    if (option.description) {
      this.description = option.description;
    }
    if (option.avatar) {
      this.avatar = option.avatar;
    }
  }

  updateOption(option: O) {
    this.fromMeta(option);
  }

  toMeta = (): ComponentMeta => {
    return {
      id: this.id,
      nickname: this.nickname,
      avatar: this.avatar,
    };
  };
}
