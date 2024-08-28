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
    const llm = this.providerManager.models.find((item) => item.models.length > 0);
    if (!llm) {
      return undefined;
    }
    const name = llm.models[0];
    const meta = llm.toSingleMeta(name);
    if (!meta) {
      return undefined;
    }
    return this.factory(meta);
  }

  updateFromProvider = () => {
    return this.providerManager.updateProviders();
  };
}
