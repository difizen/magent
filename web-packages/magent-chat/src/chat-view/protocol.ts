import type { PrioritizedContribution } from '@difizen/magent-core';
import { Syringe } from '@difizen/mana-app';
import type { FC } from 'react';

import type {
  BaseChatMessageItemModel,
  BaseChatMessageModel,
} from '../chat-base/protocol.js';

export type ChatMessageItemRenderContribution<
  O extends BaseChatMessageItemModel = BaseChatMessageItemModel,
> = PrioritizedContribution<
  O,
  FC<{ message: BaseChatMessageModel; item: BaseChatMessageItemModel }>
>;

export const ChatMessageItemRenderContribution = Syringe.defineToken(
  'ChatMessageRenderContribution',
);
