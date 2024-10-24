import { AgentDevView } from '@difizen/magent-au';
import { ApplicationContribution, ViewManager } from '@difizen/mana-app';
import { inject, singleton } from '@difizen/mana-app';

@singleton({ contrib: ApplicationContribution })
export class RagAgentApp implements ApplicationContribution {
  @inject(ViewManager) viewManager: ViewManager;

  async onStart() {
    const agentView = await this.viewManager.getOrCreateView(AgentDevView, {});
    agentView.agentId = 'demo_rag_agent';
    agentView.onViewMount();
  }
}
