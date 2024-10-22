import { ManaModule } from '@difizen/mana-app';

import { SessionModule } from '../../session/index.js';

import { SessionsView } from './view.js';

export const SessionsViewModule = ManaModule.create()
  .register(SessionsView)
  .dependOn(SessionModule);
