import { inject, prop, singleton } from '@difizen/mana-app';

import { AxiosClient } from '../axios-client/protocol.js';

import type { PluginModel } from './plugin-model.js';
import type { PluginMeta } from './protocol.js';
import { PluginFactory } from './protocol.js';

@singleton()
export class PluginManager {
  @inject(PluginFactory) toolFactory: PluginFactory;
  @inject(AxiosClient) axios: AxiosClient;
  cache: Map<string, PluginModel> = new Map();

  @prop()
  publicList: PluginModel[] = [];

  @prop()
  loading = false;

  getAll = async (): Promise<PluginMeta[]> => {
    const defaultValue: PluginMeta[] = [];
    const res = await this.axios.get<PluginMeta[]>(`/api/v1/plugins`);
    if (res.status === 200) {
      return res.data;
    }
    return defaultValue;
  };

  updatePublic = async () => {
    this.loading = true;
    const options = await this.getAll();
    this.publicList = options.map(this.getOrCreate);
    this.loading = false;
  };

  getOrCreate = (option: PluginMeta): PluginModel => {
    const exist = this.cache.get(option.id);
    if (exist) {
      exist.updateOption(option);
      return exist;
    }
    const tool = this.toolFactory(option);
    this.cache.set(tool.id, tool);
    return tool;
  };

  create = async (option: PluginMeta) => {
    const res = await this.axios.post<string>(`/api/v1/plugins/openapi`, option);
    return res;
  };
}
