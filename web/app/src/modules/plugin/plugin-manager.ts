import { inject, singleton } from '@difizen/mana-app';
import qs from 'query-string';

import { AxiosClient } from '../axios-client/index.js';
import { UserManager } from '../user/index.js';

import {
  PluginFactory,
  type Plugin,
  type PluginOption,
  type PluginMeta,
} from './protocol.js';

@singleton()
export class PluginManager {
  protected cache: Map<number, Plugin> = new Map<number, Plugin>();
  @inject(PluginFactory) pluginFactory: PluginFactory;
  @inject(UserManager) userManager: UserManager;
  @inject(AxiosClient) axios: AxiosClient;

  getMyPlugins = async (): Promise<Pagination<PluginOption>> => {
    const user = await this.userManager.currentReady;
    const defaultValue = { items: [], total: 0, page: 0, size: 0, pages: 0 };
    if (!user) {
      return defaultValue;
    }
    const query = qs.stringify({
      page: 1,
      size: 10,
      user_id: user.id,
    });
    const res = await this.axios.get<Pagination>(`api/v1/plugins?${query}`);
    if (res.status === 200) {
      return res.data;
    }
    return defaultValue;
  };

  getPlugins = async (): Promise<Pagination<PluginOption>> => {
    const defaultValue = { items: [], total: 0, page: 0, size: 0, pages: 0 };
    const query = qs.stringify({
      page: 1,
      size: 10,
    });
    const res = await this.axios.get<Pagination>(`api/v1/plugins?${query}`);
    if (res.status === 200) {
      return res.data;
    }
    return defaultValue;
  };

  createPlugin = async (meta: PluginMeta): Promise<Plugin> => {
    const user = await this.userManager.currentReady;
    if (!user) {
      throw new Error('cannot get user info');
    }
    const query = qs.stringify({
      user_id: user.id,
    });
    const res = await this.axios.post<PluginOption>(`api/v1/plugins?${query}`, meta);
    if (res.status !== 200) {
      throw new Error('failed to create agent bot');
    }
    return this.pluginFactory(res.data);
  };

  getPlugin = (option: PluginOption): Plugin => {
    const exist = this.cache.get(option.id);
    if (exist) {
      return exist;
    }
    const plugin = this.pluginFactory(option);
    this.cache.set(plugin.id, plugin);
    return plugin;
  };
}
