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

export type MesssageOpProvider = FC<{
  message: BaseChatMessageModel;
  item: BaseChatMessageItemModel;
}>;

export const MesssageOpProvider = Symbol('MesssageOpProvider');

export type MesssageContentViewProvider = FC<{
  message: BaseChatMessageModel;
  item: BaseChatMessageItemModel;
}>;

export const MesssageContentViewProvider = Symbol('MesssageContentViewProvider');

export type MesssageAddonViewProvider = FC<{
  message: BaseChatMessageModel;
  item: BaseChatMessageItemModel;
}>;

export const MesssageAddonViewProvider = Symbol('MesssageAddonViewProvider');
