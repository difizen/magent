import { inject, prop, singleton } from '@difizen/mana-app';

import { AxiosClient } from '../axios-client/protocol.js';

import type { LLMModel } from './llm-model.js';
import type { ModelMeta } from './protocol.js';
import { LLMModelFactory } from './protocol.js';

@singleton()
export class LLMManager {
  protected cache: Map<string, LLMModel> = new Map<string, LLMModel>();
  @inject(LLMModelFactory) factory: LLMModelFactory;
  @inject(AxiosClient) axios: AxiosClient;

  @prop()
  models: LLMModel[] = [];

  defaultModel?: LLMModel;

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
    this.models = metas.map((item) => this.getOrCreate(item));
    if (this.models.length > 0) {
      const defaultLLM = this.models[0];
      this.defaultModel = defaultLLM;
    }
  };

  getOrCreate = (option: ModelMeta): LLMModel => {
    const exist = this.cache.get(option.id);
    if (exist) {
      return exist;
    }
    const llm = this.factory(option);
    this.cache.set(llm.id, llm);
    return llm;
  };
}
