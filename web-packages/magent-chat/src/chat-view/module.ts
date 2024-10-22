import { ManaModule } from '@difizen/mana-app';

import { ChatMessageRender } from './chat-message-render.js';
import { DefaultChatMessageItemRenderContribution } from './default-chat-messsage-render-contribution.js';
import { ChatMessageItemRenderContribution } from './protocol.js';
import { ChatView } from './view.js';

export const ChatViewModule = ManaModule.create('magent-chat-view')
  .register(ChatView, DefaultChatMessageItemRenderContribution, ChatMessageRender)
  .contribution(ChatMessageItemRenderContribution);
