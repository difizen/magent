import { inject, prop, singleton } from '@difizen/mana-app';

import { AxiosClient } from '../axios-client/protocol.js';

import type { LLMProvider } from './llm-model.js';
import type { LLMMeta, LLMProviderMeta } from './protocol.js';
import { LLMProviderFactory } from './protocol.js';

@singleton()
export class LLMProviderManager {
  protected cache: Map<string, LLMProvider> = new Map<string, LLMProvider>();
  @inject(LLMProviderFactory) factory: LLMProviderFactory;
  @inject(AxiosClient) axios: AxiosClient;

  @prop()
  models: LLMProvider[] = [];

  protected getProviderssMeta = async () => {
    const defaultValue: LLMMeta[] = [];
    const res = await this.axios.get<LLMMeta[]>(`/api/v1/llms`);
    if (res.status === 200) {
      return res.data;
    }
    return defaultValue;
  };

  updateProviders = async () => {
    const metas = await this.getProviderssMeta();
    this.models = metas
      .map((item) => this.getOrCreate(item))
      .sort((a, b) => {
        if (b.model_name.length === 0) {
          return 1;
        }
        if (a.model_name.length === 0) {
          return -1;
        }
        return 0;
      });
  };

  getOrCreate = (option: LLMProviderMeta): LLMProvider => {
    const exist = this.cache.get(option.id);
    if (exist) {
      return exist;
    }
    const provider = this.factory(option);
    this.cache.set(provider.id, provider);
    return provider;
  };
}
