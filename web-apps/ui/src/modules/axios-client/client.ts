// api-client.js

import type { Syringe } from '@difizen/mana-app';
import axios from 'axios';
import qs from 'query-string';

import { getPageConfig } from '@/common/page-config.js';

export const getContextClient = (ctx: Syringe.Context) => {
  const pageConfig = getPageConfig();
  const baseUrl = pageConfig['baseUrl'];
  // Add a request interceptor
  axios.interceptors.request.use(async function (config) {
    // TODO: change to jwt token
    if (config.url) {
      const parsed = qs.parseUrl(config.url);
      const url = { ...parsed };
      const query = url.query;
      if (baseUrl) {
        url.url = url.url.replace(
          '/api',
          `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}api`,
        );
      }
      config.url = qs.stringifyUrl(url);
      // if (!query['user_id']) {
      //   const userManager = ctx.container.get(UserManager);
      //   await userManager.initialized;
      //   if (userManager.current) {
      //     query['user_id'] = userManager.current.id;
      //     config.url = qs.stringifyUrl(parsed);
      //   }
      // }
    }
    return config;
  });
  return axios;
};
