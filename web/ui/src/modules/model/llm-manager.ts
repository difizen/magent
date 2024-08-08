import { inject, prop, singleton } from '@difizen/mana-app';

import { AxiosClient } from '../axios-client/protocol.js';

import type { LLMModel } from './llm-model.js';
import type { ModelMeta } from './protocol.js';
import { LLMModelFactory } from './protocol.js';

@singleton()
export class LLMManager {
  @inject(LLMModelFactory) factory: LLMModelFactory;
  @inject(AxiosClient) axios: AxiosClient;

  @prop()
  models: LLMModel[] = [];

  defaultModel?: ModelMeta;

  protected getModelsMeta = async () => {
    const defaultValue: ModelMeta[] = [];
    const res = await this.axios.get<ModelMeta[]>(`/api/v1/llms`);
    if (res.status === 200) {
      return res.data;
    }
    return defaultValue;
  };

  updateModels = async () => {
    const metas = await this.getModelsMeta();
    this.models = metas.map((item) => this.factory(item));
    if (this.models.length > 0) {
      const defaultLLMs = this.models[0];
      this.defaultModel = defaultLLMs.toSingleMeta(defaultLLMs.models[0]);
    }
  };
}
