import { Syringe } from '@difizen/mana-app';

import type { LLMModel, LLMProvider } from './llm-model.js';

export interface LLMMeta {
  id: string;
  nickname: string;
  temperature: number;
  model_name: [string];
}

export type LLMModelFactory = (option: LLMMeta) => LLMModel;
export const LLMModelFactory = Syringe.defineToken('LLMModelFactory');

export const LLMModelOption = Syringe.defineToken('LLMModelOption', {
  multiple: false,
});

export interface LLMProviderMeta {
  id: string;
  nickname: string;
  temperature: number;
  model_name: string[];
}
export type LLMProviderFactory = (option: LLMProviderMeta) => LLMProvider;
export const LLMProviderFactory = Syringe.defineToken('LLMProviderFactory');

export const LLMProviderOption = Syringe.defineToken('LLMProviderOption', {
  multiple: false,
});
