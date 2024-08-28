import { inject, singleton } from '@difizen/mana-app';
import qs from 'query-string';

import { AxiosClient } from './protocol.js';

@singleton()
export class RequestHelper {
  @inject(AxiosClient) axios: AxiosClient;
  get<T>(basePath: string, params: Record<string, any>) {
    const query = qs.stringify(params);
    return this.axios.get<T>(`${basePath}?${query}`);
  }
}
