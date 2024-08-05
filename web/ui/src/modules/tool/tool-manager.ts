import { inject, singleton } from '@difizen/mana-app';

import { AxiosClient } from '../axios-client/index.js';

import { ToolFactory, type ToolModel, type ToolModelOption } from './protocol.js';

@singleton()
export class ToolManager {
  protected cache: Map<string, ToolModel> = new Map<string, ToolModel>();
  @inject(ToolFactory) toolFactory: ToolFactory;
  @inject(AxiosClient) axios: AxiosClient;

  getTools = async (): Promise<ToolModelOption[]> => {
    const defaultValue: ToolModelOption[] = [];
    const res = await this.axios.get<ToolModelOption[]>(`/api/v1/tools`);
    if (res.status === 200) {
      return res.data;
    }
    return defaultValue;
  };

  getOrCreateTool = (option: ToolModelOption): ToolModel => {
    const exist = this.cache.get(option.id);
    if (exist) {
      return exist;
    }
    const tool = this.toolFactory(option);
    this.cache.set(tool.id, tool);
    return tool;
  };
}
