import { create } from 'zustand';

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

export interface ModelStoreType {
  models: Model[];
  setModels: (models: Model[]) => void;
  modelConfig: ModelConfig;
  setModelConfig: (config: ModelConfig) => void;
}

export const useModelStore = create<ModelStoreType>((set, get) => ({
  models: [],
  setModels: (models: Model[]) => {
    set({ models });
  },
  modelConfig: {},
  setModelConfig: (modelConfig: ModelConfig) => {
    set({ modelConfig });
  },
}));
