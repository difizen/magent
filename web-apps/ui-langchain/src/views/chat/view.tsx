import { ChatView } from '@difizen/magent-chat';
import { Deferred, ViewRender } from '@difizen/mana-app';
import {
  ViewInstance,
  inject,
  singleton,
  useInject,
  view,
  BaseView,
  prop,
  ViewManager,
} from '@difizen/mana-app';
import { BoxPanel } from '@difizen/mana-react';
import { forwardRef } from 'react';

import './index.less';

const viewId = 'magent-langchain-chat';
export const slot = `${viewId}-slot`;

const AgentChatComponent = forwardRef<HTMLDivElement>(
  function AgentsViewComponent(props, ref) {
    const instance = useInject<LangchainChatView>(ViewInstance);

    return (
      <div ref={ref} className={`${viewId}-layout`}>
        <BoxPanel className={`${viewId}-layout-container`} direction="left-to-right">
          <BoxPanel.Pane className="magent-agent-chat-layout-chat" flex={1}>
            {instance.chat && <ViewRender view={instance.chat} />}
          </BoxPanel.Pane>
          {/* <BoxPanel.Pane className="magent-agent-chat-layout-history">
            {instance.sessions && <ViewRender view={instance.sessions} />}
          </BoxPanel.Pane> */}
        </BoxPanel>
      </div>
    );
  },
);

@singleton()
@view(viewId)
export class LangchainChatView extends BaseView {
  @inject(ViewManager) viewManager: ViewManager;
  override view = AgentChatComponent;

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

  disposed?: boolean | undefined;

  protected reset = () => {
    this.initializing = undefined;
    this.defaultSessionCreating = undefined;
    this.readyDeferred = new Deferred();
    this.ready = this.readyDeferred.promise;
  };

  protected async initialize() {
    const chatView = await this.viewManager.getOrCreateView(ChatView, {
      id: 'langchain',
      stream: true,
    });
    this.chat = chatView;
  }

  override onViewMount(): void {
    this.initialize();
  }
}
