// api-client.js

import type { Syringe } from '@difizen/mana-app';
import axios from 'axios';
import qs from 'query-string';

import { UserManager } from '../user/user-manager.js';

export const getContextClient = (ctx: Syringe.Context) => {
  // Add a request interceptor
  axios.interceptors.request.use(async function (config) {
    // TODO: change to jwt token
    if (config.url) {
      const parsed = qs.parseUrl(config.url);
      const query = parsed.query;
      if (!query['user_id']) {
        const userManager = ctx.container.get(UserManager);
        await userManager.initialized;
        if (userManager.current) {
          query['user_id'] = userManager.current.id;
          config.url = qs.stringifyUrl(parsed);
        }
      }
    }
    return config;
  });
  return axios;
};
