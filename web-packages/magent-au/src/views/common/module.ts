import { ManaModule } from '@difizen/mana-app';

import { MainView } from './main-view.js';

export const AUViewCommonModule =
  ManaModule.create('AUViewCommonModule').register(MainView);
