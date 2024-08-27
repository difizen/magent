import { ModalContribution, singleton } from '@difizen/mana-app';

import { DebugDrawer } from './debug-drawer.js';

@singleton({ contrib: [ModalContribution] })
export class DebugDrawerContribution implements ModalContribution {
  registerModal() {
    return DebugDrawer;
  }
}
