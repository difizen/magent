import { ViewRender } from '@difizen/mana-app';
import { ViewInstance, singleton, useInject, view } from '@difizen/mana-app';
import { BoxPanel } from '@difizen/mana-react';
import { forwardRef, useEffect } from 'react';
import { useMatch } from 'react-router-dom';

import type { AgentConfigManager } from '../../modules/agent/agent-config-manager.js';
import { AgentView } from '../agent-dev/chat-view.js';

import { AgentFlowView } from './agent-flow-view.js';

import './index.less';

const viewId = 'magent-agent-flow-dev';
export const slot = `${viewId}-slot`;

const AgentFlowDevComponent = forwardRef<HTMLDivElement>(
  function AgentsViewComponent(props, ref) {
    const instance = useInject<AgentFlowDevView>(ViewInstance);
    const match = useMatch('/agent/:agentId/flow');
    const agentId = match?.params?.agentId;
    instance.agentId = agentId;

    useEffect(() => {
      instance.openChat(instance.sessions?.active);
    }, [instance, instance.sessions?.active]);

    return (
      <div ref={ref} className={`${viewId}-layout`}>
        <BoxPanel className={`${viewId}-layout-container`} direction="left-to-right">
          {instance.agentFlow && <ViewRender view={instance.agentFlow} />}
          {/* <BoxPanel.Pane className={`${viewId}-layout-config`}>
            {instance.agentFlow && <ViewRender view={instance.agentFlow} />}
          </BoxPanel.Pane>
          <BoxPanel.Pane className={`${viewId}-layout-chat-dev`} flex={1}>
            <div className={`${viewId}-layout-chat-dev-header`}>
              <h3>预览</h3>
            </div>
            <div className={`${viewId}-layout-chat-dev-content`}>
              {instance.chat && <ViewRender view={instance.chat} />}
            </div>
          </BoxPanel.Pane> */}
        </BoxPanel>
      </div>
    );
  },
);

@singleton()
@view(viewId)
export class AgentFlowDevView extends AgentView {
  protected agentConfigManager: AgentConfigManager;

  agentFlow?: AgentFlowView;

  override view = AgentFlowDevComponent;

  protected override initialize() {
    super.initialize();
    this.initAgentFlowView();
  }

  protected initAgentFlowView = async () => {
    if (!this.agentId) {
      return;
    }
    const agentFlow = await this.viewManager.getOrCreateView(AgentFlowView, {
      agentId: this.agentId,
    });
    this.agentFlow = agentFlow;
  };
}
