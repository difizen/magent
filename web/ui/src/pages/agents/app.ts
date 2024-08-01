import { ConfigurationService } from '@difizen/mana-app';
import { SlotViewManager } from '@difizen/mana-app';
import { ApplicationContribution, ViewManager } from '@difizen/mana-app';
import { inject, singleton } from '@difizen/mana-app';

import { ModelManager } from '../../modules/model/index.js';

@singleton({ contrib: ApplicationContribution })
export class AgentBotApp implements ApplicationContribution {
  @inject(ModelManager) modelManager: ModelManager;
  @inject(ViewManager) viewManager: ViewManager;
  @inject(SlotViewManager) slotViewManager: SlotViewManager;
  @inject(ConfigurationService) configurationService: ConfigurationService;

  async onStart() {
    document.title = `magent bot`;
    this.modelManager.updateModels();
  }
}
