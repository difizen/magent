import { ModalContribution, singleton } from '@difizen/mana-app';

import { PluginCreateModal } from './create.js';

@singleton({ contrib: [ModalContribution] })
export class PluginModalContribution implements ModalContribution {
  registerModal() {
    return PluginCreateModal;
  }
}
