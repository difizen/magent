import type { Contribution, Newable } from '@difizen/mana-app';
import { Syringe } from '@difizen/mana-app';
import { registerSideOption } from '@difizen/mana-app';
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

export const prioritizedContributionFactory = <O = any, T = any>() => {
  return (
    token: Syringe.Token<PrioritizedContribution<O, T>>,
    contribution: PrioritizedContribution<O, T>,
  ) => {
    return (target: Newable<T>): void => {
      registerSideOption(
        {
          token: token,
          useValue: contribution,
          lifecycle: Syringe.Lifecycle.singleton,
        },
        target,
      );
    };
  };
};
