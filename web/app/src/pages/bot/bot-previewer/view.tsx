import type { Syringe } from '@difizen/mana-app';
import {
  BaseView,
  ObservableContext,
  ViewInstance,
  ViewManager,
  inject,
  prop,
  singleton,
  useInject,
  view,
} from '@difizen/mana-app';
import { forwardRef } from 'react';

import './index.less';
import { BotInstance } from '../../../modules/agent-bot/protocol.js';
import { Chat as ChatComponent } from '../../../modules/chat/components/chat.js';
import { ChatInstance, type Chat } from '../../../modules/chat/index.js';
import { ChatManager } from '../../../modules/chat/manager.js';
import { BotProvider } from '../bot-provider.js';

const BotPreviewerComponent = forwardRef<HTMLDivElement>(
  function BotPreviewerComponent(props, ref) {
    const instance = useInject<BotPreviewerView>(ViewInstance);
    return (
      <div ref={ref} className="bot-previewer">
        <div className="bot-previewer-header">
          <label className="bot-config-label">Preview</label>
        </div>
        <div className="bot-previewer-content">
          {instance.chatContext && (
            <ObservableContext.Provider
              value={{ getContainer: () => instance.chatContext!.container }}
            >
              <ChatComponent />
            </ObservableContext.Provider>
          )}
        </div>
      </div>
    );
  },
);

@singleton()
@view('bot-previewer')
export class BotPreviewerView extends BaseView {
  @inject(BotProvider) botProvider: BotProvider;
  @inject(ChatManager) chatManager: ChatManager;
  @inject(ViewManager) viewManager: ViewManager;

  @prop()
  chat?: Chat;

  @prop()
  chatContext?: Syringe.Context;

  override view = BotPreviewerComponent;

  override async onViewMount(): Promise<void> {
    if (this.chat) {
      return;
    }
    const bot = await this.botProvider.ready;
    const chat = await this.chatManager.getBotDebugChat(bot.id.toString());
    const context = this.viewManager.getViewContext(this);
    const child = context.container.createChild();
    child.register({ token: ChatInstance, useValue: chat });
    child.register({ token: BotInstance, useValue: bot });
    this.chatContext = { container: child };
    this.chat = chat;
  }
}
