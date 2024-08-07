import { ViewRender } from '@difizen/mana-app';
import { ViewInstance, singleton, useInject, view } from '@difizen/mana-app';
import { BoxPanel } from '@difizen/mana-react';
import { forwardRef, useEffect } from 'react';
import { useMatch } from 'react-router-dom';

import type { AgentConfigManager } from '../../modules/agent/agent-config-manager.js';
import { AgentConfigView } from '../agent-config/view.js';

import { AgentView } from './chat-view.js';

import './index.less';

const viewId = 'magent-agent-dev';
export const slot = `${viewId}-slot`;

const AgentDevComponent = forwardRef<HTMLDivElement>(
  function AgentsViewComponent(props, ref) {
    const instance = useInject<AgentDevView>(ViewInstance);
    const match = useMatch('/agent/:agentId/dev');
    const agentId = match?.params?.agentId;
    instance.agentId = agentId;

    useEffect(() => {
      instance.openChat(instance.sessions?.active);
    }, [instance, instance.sessions?.active]);

    return (
      <div ref={ref} className={`${viewId}-layout`}>
        <BoxPanel className={`${viewId}-layout-container`} direction="left-to-right">
          <BoxPanel.Pane className={`${viewId}-layout-config`} flex={1}>
            {instance.agentConfig && <ViewRender view={instance.agentConfig} />}
          </BoxPanel.Pane>
          <BoxPanel.Pane className={`${viewId}-layout-chat-dev`}>
            {instance.chat && <ViewRender view={instance.chat} />}
          </BoxPanel.Pane>
        </BoxPanel>
      </div>
    );
  },
);

@singleton()
@view(viewId)
export class AgentDevView extends AgentView {
  protected agentConfigManager: AgentConfigManager;

  agentConfig?: AgentConfigView;

  override view = AgentDevComponent;

  protected override initialize() {
    super.initialize();
    this.initAgentConfigView();
  }

  protected initAgentConfigView = async () => {
    if (!this.agentId) {
      return;
    }
    const agentConfig = await this.viewManager.getOrCreateView(AgentConfigView, {
      agentId: this.agentId,
    });
    this.agentConfig = agentConfig;
  };
}
