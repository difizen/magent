import { Syringe } from '@difizen/mana-app';

import type { KnowledgeModel } from './knowledge-model.js';

export type { KnowledgeModel } from './knowledge-model.js';

export interface KnowledgeModelOption {
  id: string;
  nickname: string;
  avatar?: string;
  description: string;
}

export const KnowledgeModelOption = Syringe.defineToken('KnowledgeModelOption', {
  multiple: false,
});

export type KnowledgeModelFactory = (options: KnowledgeModelOption) => KnowledgeModel;
export const KnowledgeModelFactory = Syringe.defineToken('KnowledgeModelFactory', {
  multiple: false,
});

export const KnowledgeModelType = {
  isOption(data?: Record<string, any>): data is KnowledgeModelOption {
    return !!(data && 'id' in data);
  },
  isFullOption(data?: Record<string, any>): boolean {
    return KnowledgeModelType.isOption(data) && 'description' in data;
  },
};
