import { RightOutlined } from '@ant-design/icons';
import { ModalService, prop, ViewRender } from '@difizen/mana-app';
import { ViewInstance, singleton, useInject, view } from '@difizen/mana-app';
import { BoxPanel } from '@difizen/mana-react';
import { Button } from 'antd';
import classNames from 'classnames';
import { forwardRef, useEffect } from 'react';
import { useMatch } from 'react-router-dom';

import type { AgentConfigManager } from '../../agent/agent-config-manager.js';
import type { Graph } from '../../workflow/protocol.js';
import { AgentChatView } from '../agent-chat/chat-view.js';
import { DebugDrawer } from '../debug/debug-drawer.js';

import { AgentFlowView } from './agent-flow-view.js';

import './index.less';

const viewId = 'magent-agent-flow-dev';
export const AgentFlowDevSlot = `${viewId}-slot`;

const AgentFlowDevComponent = forwardRef<HTMLDivElement>(
  function AgentsViewComponent(props, ref) {
    const instance = useInject<AgentFlowDevView>(ViewInstance);
    const modalService = useInject<ModalService>(ModalService);
    const match = useMatch('/agent/:agentId/flow');
    const agentId = match?.params?.agentId;
    instance.agentId = agentId;

    useEffect(() => {
      instance.openChat(instance.sessions?.active);
    }, [instance, instance.sessions?.active]);

    return (
      <div ref={ref} className={`${viewId}-layout`}>
        <BoxPanel className={`${viewId}-layout-container`} direction="left-to-right">
          <BoxPanel.Pane className={`${viewId}-layout-config`} flex={1}>
            {instance.agentFlow && <ViewRender view={instance.agentFlow} />}
          </BoxPanel.Pane>
          <BoxPanel.Pane
            className={classNames(`${viewId}-layout-chat-dev`, {
              [`${viewId}-layout-chat-dev-hide`]: instance.hideChat,
            })}
          >
            <div className={`${viewId}-layout-chat-dev-header`}>
              <div className={`${viewId}-layout-chat-dev-header-left`}>
                <Button
                  onClick={() => (instance.hideChat = true)}
                  type="text"
                  icon={<RightOutlined />}
                ></Button>
                <h3>预览</h3>
              </div>
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
export class AgentFlowDevView extends AgentChatView {
  @prop()
  hideChat = true;

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

  save = async (graph: Graph) => {
    const res = await this.agentFlow?.saveGraph(graph);
    if (res?.status === 200) {
      return await this.agent?.save();
    }
    return false;
  };
}
