import { ViewRender } from '@difizen/mana-app';
import {
  BaseView,
  ViewInstance,
  inject,
  singleton,
  useInject,
  view,
  prop,
  ViewManager,
} from '@difizen/mana-app';
import { BoxPanel } from '@difizen/mana-react';
import { forwardRef, useEffect } from 'react';
import { useMatch } from 'react-router-dom';

import { AgentManager } from '../../modules/agent/agent-manager.js';
import type { AgentModel } from '../../modules/agent/protocol.js';
import type { SessionOption } from '../../modules/session/protocol.js';
import { ChatView } from '../chat/view.js';
import { SessionsView } from '../sessions/view.js';

import './index.less';

const viewId = 'magent-agent-chat';
export const slot = `${viewId}-slot`;

const AgentChatComponent = forwardRef<HTMLDivElement>(
  function AgentsViewComponent(props, ref) {
    const instance = useInject<AgentView>(ViewInstance);
    const match = useMatch('/agent/:agentId/chat');
    const agentId = match?.params?.agentId;
    instance.agentId = agentId;

    useEffect(() => {
      if (instance.sessions?.active) {
        instance.openChat(instance.sessions?.active);
      }
    }, [instance, instance.sessions?.active]);

    return (
      <div ref={ref} className={`${viewId}-layout`}>
        <BoxPanel direction="left-to-right">
          <BoxPanel.Pane className="magent-agent-chat-layout-history">
            {instance.sessions && <ViewRender view={instance.sessions} />}
          </BoxPanel.Pane>
          <BoxPanel.Pane className="magent-agent-chat-layout-chat" flex={1}>
            {instance.chat && <ViewRender view={instance.chat} />}
          </BoxPanel.Pane>
        </BoxPanel>
      </div>
    );
  },
);

@singleton()
@view(viewId)
export class AgentView extends BaseView {
  agentId?: string;
  @inject(AgentManager) agentManager: AgentManager;
  @inject(ViewManager) viewManager: ViewManager;
  override view = AgentChatComponent;

  @prop()
  agent?: AgentModel;

  @prop()
  sessions?: SessionsView;

  @prop()
  chat?: ChatView;

  protected initAgent = () => {
    if (this.agentId) {
      const agent = this.agentManager.getOrCreateAgent({ id: this.agentId });
      agent.fetchInfo();
      this.agent = agent;
    }
  };

  protected initSessionView = async () => {
    if (!this.agentId) {
      return;
    }
    const sessions = await this.viewManager.getOrCreateView(SessionsView, {
      agentId: this.agentId,
    });
    this.sessions = sessions;
  };

  override onViewMount(): void {
    this.initAgent();
    this.initSessionView();
  }

  openChat = async (session: SessionOption) => {
    const chatView = await this.viewManager.getOrCreateView(ChatView, {
      agentId: session.agentId,
      sessionId: session.id,
    });
    this.chat = chatView;
  };
}
