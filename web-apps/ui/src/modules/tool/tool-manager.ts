import { inject, singleton } from '@difizen/mana-app';

import { AxiosClient } from '../axios-client/protocol.js';

import type { ToolMeta } from './protocol.js';
import { ToolFactory, type ToolModel } from './protocol.js';

@singleton()
export class ToolManager {
  protected cache: Map<string, ToolModel> = new Map<string, ToolModel>();
  @inject(ToolFactory) toolFactory: ToolFactory;
  @inject(AxiosClient) axios: AxiosClient;

  getAll = async (): Promise<ToolMeta[]> => {
    const defaultValue: ToolMeta[] = [];
    const res = await this.axios.get<ToolMeta[]>(`/api/v1/tools`);
    if (res.status === 200) {
      return res.data;
    }
    return defaultValue;
  };

  getOrCreate = (option: ToolMeta): ToolModel => {
    const exist = this.cache.get(option.id);
    if (exist) {
      exist.updateOption(option);
      return exist;
    }
    const tool = this.toolFactory(option);
    this.cache.set(tool.id, tool);
    return tool;
  };
}
