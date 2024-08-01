import { ConfigurationService } from '@difizen/mana-app';
import { SlotViewManager } from '@difizen/mana-app';
import { ApplicationContribution, ViewManager } from '@difizen/mana-app';
import { inject, singleton } from '@difizen/mana-app';

import { ModelManager } from '../../modules/model/index.js';
import { UserManager } from '../../modules/user/user-manager.js';

import { BotProvider } from './bot-provider.js';

@singleton({ contrib: ApplicationContribution })
export class AgentBotApp implements ApplicationContribution {
  @inject(ModelManager) modelManager: ModelManager;
  @inject(UserManager) userManager: UserManager;
  @inject(BotProvider) botProvider: BotProvider;
  @inject(ViewManager) viewManager: ViewManager;
  @inject(SlotViewManager) slotViewManager: SlotViewManager;
  @inject(ConfigurationService) configurationService: ConfigurationService;

  async onStart() {
    document.title = `magent bot`;
    this.userManager.initialize();
    this.modelManager.updateModels();
  }
}
