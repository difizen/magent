import { ManaModule } from '@difizen/mana-app';

import { ChatMessageRender } from './chat-message-render.js';
import { AIMessageAddon, AIMessageContent } from './components/message/ai-message.js';
import { MessageOp } from './components/message/message-op.js';
import { DefaultChatMessageItemRenderContribution } from './default-chat-messsage-render-contribution.js';
import {
  ChatMessageItemRenderContribution,
  MesssageOpProvider,
  MesssageContentViewProvider,
  MesssageAddonViewProvider,
} from './protocol.js';
import { ChatView } from './view.js';

export const ChatViewModule = ManaModule.create('magent-chat-view')
  .register(
    {
      token: MesssageOpProvider,
      useValue: MessageOp,
    },
    {
      token: MesssageContentViewProvider,
      useValue: AIMessageContent,
    },
    {
      token: MesssageAddonViewProvider,
      useValue: AIMessageAddon,
    },
    ChatView,
    DefaultChatMessageItemRenderContribution,
    ChatMessageRender,
  )
  .contribution(ChatMessageItemRenderContribution);
