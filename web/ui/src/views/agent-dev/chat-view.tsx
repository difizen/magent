import { Deferred, ViewRender } from '@difizen/mana-app';
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
import type { SessionModel } from '../../modules/session/protocol.js';
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
      instance.openChat(instance.sessions?.active);
    }, [instance, instance.sessions?.active]);

    return (
      <div ref={ref} className={`${viewId}-layout`}>
        <BoxPanel className={`${viewId}-layout-container`} direction="left-to-right">
          <BoxPanel.Pane className="magent-agent-chat-layout-chat" flex={1}>
            {instance.chat && <ViewRender view={instance.chat} />}
          </BoxPanel.Pane>
          <BoxPanel.Pane className="magent-agent-chat-layout-history">
            {instance.sessions && <ViewRender view={instance.sessions} />}
          </BoxPanel.Pane>
        </BoxPanel>
      </div>
    );
  },
);

@singleton()
@view(viewId)
export class AgentView extends BaseView {
  protected _agentId?: string;

  get agentId(): string | undefined {
    return this._agentId;
  }
  set agentId(v) {
    if (v !== this._agentId) {
      this.reset();
    }
    this._agentId = v;
  }
  @inject(AgentManager) agentManager: AgentManager;
  @inject(ViewManager) viewManager: ViewManager;
  override view = AgentChatComponent;

  @prop()
  agent?: AgentModel;

  @prop()
  sessions?: SessionsView;

  @prop()
  chat?: ChatView;

  initializing?: Promise<void>;
  defaultSessionCreating?: Promise<void>;
  ready: Promise<void>;
  protected readyDeferred: Deferred<void> = new Deferred();

  constructor() {
    super();
    this.ready = this.readyDeferred.promise;
  }

  protected reset = () => {
    this.initializing = undefined;
    this.defaultSessionCreating = undefined;
    this.readyDeferred = new Deferred();
    this.ready = this.readyDeferred.promise;
  };
  protected initAgent = () => {
    if (this.agentId) {
      const agent = this.agentManager.getOrCreateAgent({ id: this.agentId });
      agent.fetchInfo();
      this.agent = agent;
      return agent;
    }
    return undefined;
  };

  protected initSessionView = async () => {
    if (!this.agentId) {
      return;
    }
    const sessions = await this.viewManager.getOrCreateView(SessionsView, {
      agentId: this.agentId,
    });
    this.sessions = sessions;
    await sessions.ensureActive();
  };

  protected getAgentTitleName = async (agent: AgentModel) => {
    if (agent.name) {
      return agent.name;
    } else {
      await agent.ready;
      return agent.name;
    }
  };
  protected updateTitle = async (agent: AgentModel) => {
    const title = await this.getAgentTitleName(agent);
    if (title) {
      document.title = title;
    }
  };

  protected initialize() {
    const agent = this.initAgent();
    if (agent) {
      this.updateTitle(agent);
    }
    this.initSessionView();
  }

  ensureInitialized = async () => {
    if (!this.initializing) {
      this.initializing = this.ready;
      this.initialize();
    }
    return this.initializing;
  };

  override onViewMount(): void {
    this.ensureInitialized();
  }

  openChat = async (session?: SessionModel) => {
    if (!session) {
      this.chat = undefined;
      return;
    }
    const chatView = await this.viewManager.getOrCreateView(ChatView, {
      agentId: session.agentId,
      sessionId: session.id,
    });
    this.chat = chatView;
  };
}
