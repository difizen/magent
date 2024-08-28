import type React from 'react';
import { create } from 'zustand';

import type { BasicSchema } from '@/interfaces/flow.js';

// 注册 模型选择和配置组件 提供onChange事件
export interface Model {
  id: string;
  name: string;
  group?: string;
  description?: string;
}

export interface ModelConfig {
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  [key: string]: number | undefined;
}

export type ModelSelectorNode =
  | ((props: { nodeId: string; llmParam: BasicSchema[] }) => React.ReactNode)
  | null;

export interface ModelStoreType {
  ModelSelector: ModelSelectorNode;
  setModelSelector: (ModelSelector: ModelSelectorNode) => void;
  modelOptions: Model[];
  setModelOptions: (models: Model[]) => void;
  modelConfig: ModelConfig;
  setModelConfig: (config: ModelConfig) => void;
}

export const useModelStore = create<ModelStoreType>((set) => ({
  ModelSelector: null,
  setModelSelector: (ModelSelector) => {
    set({ ModelSelector });
  },

  modelOptions: [],
  setModelOptions: (modelOptions: Model[]) => {
    set({ modelOptions });
  },
  modelConfig: {},
  setModelConfig: (modelConfig: ModelConfig) => {
    set({ modelConfig });
  },
}));
