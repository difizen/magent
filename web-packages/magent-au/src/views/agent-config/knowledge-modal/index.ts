import { ModalContribution, singleton } from '@difizen/mana-app';

import { KnowledgeModal } from './modal.js';

@singleton({ contrib: [ModalContribution] })
export class KnowledgeModalContribution implements ModalContribution {
  registerModal() {
    return KnowledgeModal;
  }
}
