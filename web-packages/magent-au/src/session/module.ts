import { ManaModule } from '@difizen/mana-app';

import { SessionManager } from './session-manager.js';
import { SessionModel } from './session-model.js';

export const SessionModule = ManaModule.create().register(SessionModel, SessionManager);
