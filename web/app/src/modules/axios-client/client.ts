// api-client.js

import type { Syringe } from '@difizen/mana-app';
import axios from 'axios';

import { UserManager } from '../user/user-manager.js';

export const getContextClient = (ctx: Syringe.Context) => {
  // Add a request interceptor
  axios.interceptors.request.use(async function (config) {
    // TODO: change to jwt token
    if (config.url) {
      const url = new URL(config.url);
      if (!url.searchParams.has('user_id')) {
        const userManager = ctx.container.get(UserManager);
        await userManager.initialized;
        if (userManager.current) {
          url.searchParams.append('user_id', userManager.current.id);
          config.url = url.toString();
        }
      }
    }
    return config;
  });
  return axios;
};
