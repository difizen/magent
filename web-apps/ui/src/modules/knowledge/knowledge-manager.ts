import { inject, prop, singleton } from '@difizen/mana-app';

import { AxiosClient } from '../axios-client/protocol.js';

import {
  KnowledgeModelFactory,
  type KnowledgeModel,
  type KnowledgeModelOption,
} from './protocol.js';

@singleton()
export class KnowledgeManager {
  protected cache: Map<string, KnowledgeModel> = new Map<string, KnowledgeModel>();
  @inject(KnowledgeModelFactory) factory: KnowledgeModelFactory;
  @inject(AxiosClient) axios: AxiosClient;

  @prop()
  knowledgeOptions: KnowledgeModelOption[] = [];

  getAll = async (): Promise<KnowledgeModelOption[]> => {
    const defaultValue: KnowledgeModelOption[] = [];
    const res = await this.axios.get<KnowledgeModelOption[]>(`/api/v1/knowledge`);
    if (res.status === 200) {
      return res.data;
    }
    return defaultValue;
  };

  getOrCreate = (option: KnowledgeModelOption): KnowledgeModel => {
    const exist = this.cache.get(option.id);
    if (exist) {
      return exist;
    }
    const tool = this.factory(option);
    this.cache.set(tool.id, tool);
    return tool;
  };
}
