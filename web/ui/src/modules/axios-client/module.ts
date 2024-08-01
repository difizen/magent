import { ManaModule, Syringe } from '@difizen/mana-app';

import { UserModule } from '../user/module.js';

import { getContextClient } from './client.js';
import { AxiosClient } from './protocol.js';

export const AxiosClientModule = ManaModule.create()
  .register({
    token: AxiosClient,
    useDynamic: getContextClient,
    lifecycle: Syringe.Lifecycle.singleton,
  })
  .dependOn(UserModule);
