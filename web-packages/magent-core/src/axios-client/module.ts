import { ManaModule, Syringe } from '@difizen/mana-app';

import { getContextClient } from './client.js';
import { AxiosClient } from './protocol.js';
import { RequestHelper } from './request.js';

export const AxiosClientModule = ManaModule.create()
  .register(RequestHelper, {
    token: AxiosClient,
    useDynamic: getContextClient,
    lifecycle: Syringe.Lifecycle.singleton,
  })
  .dependOn();
