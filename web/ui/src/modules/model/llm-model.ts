import { inject, prop, transient } from '@difizen/mana-app';

import { LLMModelOption, type ModelMeta } from './protocol.js';

@transient()
export class LLMModel {
  id: string;
  name: string;
  models: string[] = [];

  @prop()
  temperature: number;

  protected configStr: string;

  constructor(@inject(LLMModelOption) meta: ModelMeta) {
    this.id = meta.id;
    this.name = meta.nickname;
    this.models = meta.model_name;
  }

  toSingleMeta = (name: string): ModelMeta | undefined => {
    if (!this.models.includes(name)) {
      return undefined;
    }
    const meta = this.toMeta();
    meta.model_name = [name];
    return meta;
  };

  toMeta = (): ModelMeta => {
    const meta: ModelMeta = {
      id: this.id,
      nickname: this.name,
      model_name: this.models,
      temperature: this.temperature,
    };
    return meta;
  };

  toSingleMetas = () => {
    return this.models.map(this.toSingleMeta);
  };
}
