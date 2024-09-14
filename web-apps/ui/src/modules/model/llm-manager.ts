import { inject, singleton } from '@difizen/mana-app';

import type { LLMModel, LLMProvider } from './llm-model.js';
import { LLMProviderManager } from './llm-provider-manager.js';
import { LLMModelFactory } from './protocol.js';

@singleton()
export class LLMManager {
  protected cache: Map<string, LLMProvider> = new Map<string, LLMProvider>();
  @inject(LLMModelFactory) factory: LLMModelFactory;
  @inject(LLMProviderManager) protected providerManager: LLMProviderManager;

  get default(): LLMModel | undefined {
    const defaultProvider = this.providerManager.models[0];
    if (!defaultProvider) {
      return undefined;
    }
    const llm = defaultProvider.toSingleMeta(defaultProvider.model_name[0]);
    if (!llm) {
      return undefined;
    }
    return this.factory(llm);
  }

  updateFromProvider = () => {
    return this.providerManager.updateProviders();
  };
}
