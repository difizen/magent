import { inject, singleton } from '@difizen/mana-app';
import qs from 'query-string';

import { AxiosClient } from '../axios-client/index.js';

import {
  ToolFactory,
  type Tool,
  type ToolOption,
  type ToolMeta,
} from './protocol.js';

@singleton()
export class ToolManager {
  protected cache: Map<number, Tool> = new Map<number, Tool>();
  @inject(ToolFactory) pluginFactory: ToolFactory;
  @inject(AxiosClient) axios: AxiosClient;

  getMyTools = async (): Promise<Pagination<ToolOption>> => {
    const defaultValue = { items: [], total: 0, page: 0, size: 0, pages: 0 };
    const query = qs.stringify({
      page: 1,
      size: 10,
    });
    const res = await this.axios.get<Pagination>(`api/v1/plugins/?${query}`);
    if (res.status === 200) {
      return res.data;
    }
    return defaultValue;
  };

  getTools = async (): Promise<Pagination<ToolOption>> => {
    const defaultValue = { items: [], total: 0, page: 0, size: 0, pages: 0 };
    const query = qs.stringify({
      page: 1,
      size: 10,
    });
    const res = await this.axios.get<Pagination>(`api/v1/plugins/?${query}`);
    if (res.status === 200) {
      return res.data;
    }
    return defaultValue;
  };

  createTool = async (meta: ToolMeta): Promise<Tool> => {
    const res = await this.axios.post<ToolOption>(`api/v1/plugins`, meta);
    if (res.status !== 200) {
      throw new Error('failed to create agent bot');
    }
    return this.pluginFactory(res.data);
  };

  getTool = (option: ToolOption): Tool => {
    const exist = this.cache.get(option.id);
    if (exist) {
      return exist;
    }
    const plugin = this.pluginFactory(option);
    this.cache.set(plugin.id, plugin);
    return plugin;
  };
}
