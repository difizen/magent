import { ManaModule } from '@difizen/mana-app';

import { ChatMessageRender } from './chat-message-render.js';
import { MessageOp } from './components/message/message-op.js';
import { DefaultChatMessageItemRenderContribution } from './default-chat-messsage-render-contribution.js';
import { ChatMessageItemRenderContribution, MesssageOpProvider } from './protocol.js';
import { ChatView } from './view.js';

export const ChatViewModule = ManaModule.create('magent-chat-view')
  .register(
    {
      token: MesssageOpProvider,
      useValue: MessageOp,
    },
    ChatView,
    DefaultChatMessageItemRenderContribution,
    ChatMessageRender,
  )
  .contribution(ChatMessageItemRenderContribution);
