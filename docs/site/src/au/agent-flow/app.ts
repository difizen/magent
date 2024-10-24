import { AgentFlowDevView, MainView } from '@difizen/magent-au';
import { ApplicationContribution, ViewManager } from '@difizen/mana-app';
import { inject, singleton } from '@difizen/mana-app';

@singleton({ contrib: ApplicationContribution })
export class AgentApp implements ApplicationContribution {
  @inject(ViewManager) viewManager: ViewManager;
  @inject(MainView) mainView: MainView;

  async onStart() {
    const agentView = await this.viewManager.getOrCreateView(AgentFlowDevView, {});
    this.mainView.active = agentView;
    agentView.agentId = 'demo_workflow_agent';
    agentView.onViewMount();
  }
}
