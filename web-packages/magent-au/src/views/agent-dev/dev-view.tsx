import { ModalService, ViewRender } from '@difizen/mana-app';
import { ViewInstance, singleton, useInject, view } from '@difizen/mana-app';
import { BoxPanel } from '@difizen/mana-react';
import { Button } from 'antd';
import { forwardRef, useEffect } from 'react';
import { useMatch } from 'react-router-dom';

import type { AgentConfigManager } from '../../agent/agent-config-manager.js';
import { AgentConfigView } from '../agent-config/view.js';
import { DebugDrawer } from '../debug/debug-drawer.js';

import { AgentView } from './chat-view.js';
import './index.less';

const viewId = 'magent-agent-dev';
export const slot = `${viewId}-slot`;

const AgentDevComponent = forwardRef<HTMLDivElement>(
  function AgentsViewComponent(props, ref) {
    const instance = useInject<AgentDevView>(ViewInstance);
    const modalService = useInject<ModalService>(ModalService);
    const match = useMatch('/agent/:agentId/dev');
    const agentId = match?.params?.agentId;
    instance.agentId = agentId;

    useEffect(() => {
      instance.openChat(instance.sessions?.active);
    }, [instance, instance.sessions?.active]);

    return (
      <div ref={ref} className={`${viewId}-layout`}>
        <BoxPanel className={`${viewId}-layout-container`} direction="left-to-right">
          <BoxPanel.Pane className={`${viewId}-layout-config`}>
            {instance.agentConfig && <ViewRender view={instance.agentConfig} />}
          </BoxPanel.Pane>
          <BoxPanel.Pane className={`${viewId}-layout-chat-dev`} flex={1}>
            <div className={`${viewId}-layout-chat-dev-header`}>
              <h3>预览</h3>
              <Button
                onClick={() => {
                  modalService.openModal(DebugDrawer, { chat: instance.chat });
                }}
                type="text"
              >
                调试
              </Button>
            </div>
            <div className={`${viewId}-layout-chat-dev-content`}>
              {instance.chat && <ViewRender view={instance.chat} />}
            </div>
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
