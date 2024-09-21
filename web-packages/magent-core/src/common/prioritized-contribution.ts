import type { Contribution } from '@difizen/mana-app';
import { Priority, singleton } from '@difizen/mana-app';

export interface PrioritizedContribution<O = any, T = any> {
  canHandle: (option: O) => number;
  handle: (option: O) => T;
}

@singleton()
export class PrioritizedContributionManager<
  O = any,
  T extends PrioritizedContribution<O> = PrioritizedContribution,
> {
  protected findContribution(option: O, provider: Contribution.Provider<T>): T {
    const prioritized = Priority.sortSync(provider.getContributions(), (contribution) =>
      contribution.canHandle(option),
    );
    const sorted = prioritized.map((c) => c.value);
    return sorted[0];
  }
}
