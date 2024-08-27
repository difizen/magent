import { ModalContribution, singleton } from '@difizen/mana-app';

import { ToolsModal } from './modal.js';

@singleton({ contrib: [ModalContribution] })
export class ToolsModalContribution implements ModalContribution {
  registerModal() {
    return ToolsModal;
  }
}
