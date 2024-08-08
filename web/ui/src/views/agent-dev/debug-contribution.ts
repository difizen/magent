import { ModalContribution, singleton } from '@difizen/mana-app';

import { DebugModal } from './debug-modal.js';

@singleton({ contrib: [ModalContribution] })
export class DebugContribution implements ModalContribution {
  registerModal() {
    return DebugModal;
  }
}
