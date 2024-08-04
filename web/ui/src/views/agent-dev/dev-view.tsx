import type { Syringe } from '@difizen/mana-app';
import {
  BaseView,
  ViewInstance,
  inject,
  singleton,
  useInject,
  view,
  prop,
  Slot,
  ViewManager,
} from '@difizen/mana-app';
import { BoxPanel } from '@difizen/mana-react';
import { forwardRef } from 'react';
import { useMatch } from 'react-router-dom';

import { AgentManager } from '../../modules/agent/agent-manager.js';
import type { AgentModel } from '../../modules/agent/protocol.js';
import { AgentInstance } from '../../modules/agent/protocol.js';

import './index.less';
import { AgentLayoutSlots } from './protocol.js';

const viewId = 'magent-agent-dev';
export const slot = `${viewId}-slot`;

const AgentDevComponent = forwardRef<HTMLDivElement>(
  function AgentsViewComponent(props, ref) {
    const instance = useInject<AgentDevView>(ViewInstance);
    const match = useMatch('/agent/:agentId/dev');
    const agentId = match?.params?.agentId;
    instance.agentId = agentId;

    return (
      <div ref={ref} className={viewId}>
        <BoxPanel direction="left-to-right">
          <BoxPanel.Pane className="bot-layout-config" flex={1}>
            <Slot name={AgentLayoutSlots.config} />
          </BoxPanel.Pane>
          <BoxPanel.Pane className="bot-layout-preview">
            <Slot name={AgentLayoutSlots.chat} />
          </BoxPanel.Pane>
        </BoxPanel>
      </div>
    );
  },
);

@singleton()
@view(viewId)
export class AgentDevView extends BaseView {
  agentId?: string;
  @inject(AgentManager) agentManager: AgentManager;
  @inject(ViewManager) viewManager: ViewManager;
  override view = AgentDevComponent;

  @prop()
  agent?: AgentModel;

  agentContext: Syringe.Context;

  protected initAgent = () => {
    if (this.agentId) {
      const agent = this.agentManager.getOrCreateAgent({ id: this.agentId });
      agent.fetchInfo();
      this.agent = agent;
    }
  };

  protected initContext = () => {
    if (this.agent) {
      const context = this.viewManager.getViewContext(this);
      const child = context.container.createChild();
      child.register({ token: AgentInstance, useValue: this.agent });
      this.agentContext = { container: child };
    }
  };

  override onViewMount(): void {
    this.initAgent();
    this.initContext();
  }
}
