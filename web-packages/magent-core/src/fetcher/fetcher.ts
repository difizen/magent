import { inject, singleton } from '@difizen/mana-app';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import qs from 'query-string';

import { AxiosClient } from './protocol.js';

export type FecterResponse<T = any, D = any> = AxiosResponse<T, D>;

@singleton()
export class Fetcher {
  @inject(AxiosClient) axios: AxiosClient;
  get = <T>(
    basePath: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig<any>,
  ): Promise<FecterResponse<T, any>> => {
    let url = basePath;
    if (params) {
      url = `${url}?${qs.stringify(params)}`;
    }
    return this.axios.get<T>(url, config);
  };

  post = async <T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig<any>,
  ): Promise<FecterResponse<T, any>> => {
    return this.axios.post<T>(url, data, config);
  };

  put = async <T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig<any>,
  ): Promise<FecterResponse<T, any>> => {
    return this.axios.put<T>(url, data, config);
  };
  delete = async <T>(
    url: string,
    config?: AxiosRequestConfig<any>,
  ): Promise<FecterResponse<T, any>> => {
    return this.axios.delete<T>(url, config);
  };
}
