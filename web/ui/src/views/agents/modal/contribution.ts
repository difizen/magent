import { ModalContribution, singleton } from '@difizen/mana-app';

import { AgentCreateModal } from './create.js';

@singleton({ contrib: [ModalContribution] })
export class AgentModalContribution implements ModalContribution {
  registerModal() {
    return AgentCreateModal;
  }
}
