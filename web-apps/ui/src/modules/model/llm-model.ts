import { inject, prop, transient } from '@difizen/mana-app';

import type { LLMProviderMeta } from './protocol.js';
import { LLMProviderOption } from './protocol.js';
import { LLMModelOption, type LLMMeta } from './protocol.js';

@transient()
export class LLMProvider implements LLMProviderMeta {
  id: string;

  @prop()
  nickname: string;

  @prop()
  model_name: string[] = [];

  get name(): string {
    return this.nickname;
  }
  set name(v: string) {
    this.nickname = v;
  }

  get models(): string[] {
    return this.model_name;
  }
  set models(v: string[]) {
    this.models = v;
  }

  @prop()
  temperature: number;

  protected configStr: string;

  constructor(@inject(LLMProviderOption) meta: LLMProviderMeta) {
    this.id = meta.id;
    this.nickname = meta.nickname;
    this.model_name = meta.model_name;
  }

  toSingleMeta = (name: string): LLMMeta | undefined => {
    if (!this.models.includes(name)) {
      return undefined;
    }
    const meta = this.toMeta();
    return { ...meta, model_name: [name] };
  };

  toMeta = (): LLMProviderMeta => {
    const meta: LLMProviderMeta = {
      id: this.id,
      nickname: this.nickname,
      model_name: this.model_name,
      temperature: this.temperature,
    };
    return meta;
  };

  toSingleMetas = () => {
    return this.models.map(this.toSingleMeta);
  };
}

@transient()
export class LLMModel implements LLMMeta {
  id: string;

  @prop()
  nickname: string;

  @prop()
  model_name: [string];

  get name(): string {
    return this.nickname;
  }
  set name(v: string) {
    this.nickname = v;
  }

  get models(): string[] {
    return this.model_name;
  }
  set models(v: string[]) {
    this.models = v;
  }

  @prop()
  temperature: number;

  protected configStr: string;

  constructor(@inject(LLMModelOption) meta: LLMMeta) {
    this.id = meta.id;
    this.nickname = meta.nickname;
    this.model_name = meta.model_name;
    this.updateMeta(meta);
  }

  updateMeta = (meta?: LLMMeta) => {
    if (!meta) {
      return;
    }
    if (this.id !== meta.id) {
      this.id = meta.id;
    }
    if (this.nickname !== meta.nickname) {
      this.nickname = meta.nickname;
    }
    if (this.temperature !== meta.temperature) {
      this.temperature = meta.temperature;
    }
    if (this.model_name.join(',') !== meta.model_name.join(',')) {
      this.model_name = meta.model_name;
    }
  };

  toMeta = (): LLMMeta => {
    const meta: LLMMeta = {
      id: this.id,
      nickname: this.nickname,
      model_name: this.model_name,
      temperature: this.temperature,
    };
    return meta;
  };
}
