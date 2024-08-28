import { create } from 'zustand';

import type { BasicSchema } from '@flow/interfaces/flow.js';

export interface Knowledge {
  name: string;
  id: string;
  description?: string;
}

export type KnowledgeSelectorNode =
  | ((props: { nodeId: string; knowledgeParam: BasicSchema[] }) => React.ReactNode)
  | null;

export interface KnowledgeStoreType {
  KnowledgeSelector: KnowledgeSelectorNode | null;
  setKnowledgeSelector: (KnowledgeSelector: KnowledgeSelectorNode) => void;
}

export const useKnowledgeStore = create<KnowledgeStoreType>((set) => ({
  KnowledgeSelector: null,
  setKnowledgeSelector: (KnowledgeSelector) => {
    set({ KnowledgeSelector });
  },
}));
