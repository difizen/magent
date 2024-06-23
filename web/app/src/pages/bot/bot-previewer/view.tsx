import { BaseView, inject, prop, singleton, view } from '@difizen/mana-app';
import { forwardRef } from 'react';

import './index.less';
import { Chat as ChatComponent } from '../../../modules/chat/components/chat.js';
import type { Chat } from '../../../modules/chat/index.js';
import { ChatManager } from '../../../modules/chat/manager.js';
import { BotProvider } from '../bot-provider.js';

const BotPreviewerComponent = forwardRef<HTMLDivElement>(
  function BotPreviewerComponent(props, ref) {
    return (
      <div ref={ref} className="bot-previewer">
        <div className="bot-previewer-header">
          <label className="bot-config-label">Preview</label>
        </div>
        <div className="bot-previewer-content">
          <ChatComponent />
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

  @prop()
  chat?: Chat;

  override view = BotPreviewerComponent;

  override async onViewMount(): Promise<void> {
    if (this.chat) {
      return;
    }
    const bot = await this.botProvider.ready;
    this.chat = await this.chatManager.getBotDebugChat(bot.id.toString());
  }
}
