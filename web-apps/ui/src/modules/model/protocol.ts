import { Syringe } from '@difizen/mana-app';

import type { LLMModel } from './llm-model.js';

export interface ModelMeta {
  id: string;
  nickname: string;
  temperature: number;
  model_name: string[];
}

export type LLMModelFactory = (option: ModelMeta) => LLMModel;
export const LLMModelFactory = Syringe.defineToken('LLMModelFactory');

export const LLMModelOption = Syringe.defineToken('LLMModelOption', {
  multiple: false,
});
