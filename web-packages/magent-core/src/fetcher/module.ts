import { ManaModule, Syringe } from '@difizen/mana-app';

import { getContextClient } from './client.js';
import { Fetcher } from './fetcher.js';
import { AxiosClient } from './protocol.js';

export const FetcherModule = ManaModule.create()
  .register(Fetcher, {
    token: AxiosClient,
    useDynamic: getContextClient,
    lifecycle: Syringe.Lifecycle.singleton,
  })
  .dependOn();
