import { ManaModule } from '@difizen/mana-app';

import { AIChatMessageItemModel } from './ai-message-item-model.js';
import { DefaultChatMessageItemContribution } from './chat-message-item-contibution.js';
import { ChatMessageItemManager } from './chat-message-item-manager.js';
import {
  DefaultChatMessageItemModel,
  HumanChatMessageItemModel,
} from './chat-message-item-model.js';
import { ChatMessageManager } from './chat-message-manager.js';
import { DefaultChatMessageModel } from './chat-message-model.js';
import {
  ChatMessageSummaryProvider,
  DefaultChatMessageSummary,
} from './chat-messasge-summary.js';
import { ChatService } from './chat-service.js';
import { ConversationManager } from './conversation-manager.js';
import { DefaultConversationModel } from './conversation-model.js';
import { ChatMessageItemContribution } from './protocol.js';

export const ChatBaseModule = ManaModule.create('magent-chat-base')
  .register(
    ChatService,
    ConversationManager,
    DefaultConversationModel,
    ChatMessageManager,
    DefaultChatMessageModel,
    DefaultChatMessageItemModel,
    HumanChatMessageItemModel,
    AIChatMessageItemModel,
    ChatMessageItemManager,
    DefaultChatMessageItemContribution,
    DefaultChatMessageSummary,
    ChatMessageSummaryProvider,
  )
  .contribution(ChatMessageItemContribution);
