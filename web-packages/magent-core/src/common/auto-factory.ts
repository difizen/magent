import type { Newable } from '@difizen/mana-app';
import { transient } from '@difizen/mana-app';
import { inject } from '@difizen/mana-app';
import { registerSideOption } from '@difizen/mana-app';
import { Syringe } from '@difizen/mana-app';

export const AutoFactoryOption = Syringe.defineToken('AutoFactoryOption');
export const AutoFactoryMeta = Symbol('AutoFactoryMeta');

export function autoFactory<T = any>() {
  return (target: Newable<T>): void => {
    const AutoFactoryToken = Symbol();
    Reflect.defineMetadata(AutoFactoryMeta, AutoFactoryToken, target);
    transient()(target);
    registerSideOption(
      {
        token: AutoFactoryToken,
        useFactory: (ctx: Syringe.Context) => {
          return (option: any) => {
            const child = ctx.container.createChild();
            child.register({ token: AutoFactoryOption, useValue: option });
            return child.get(target);
          };
        },
      },
      target,
    );
  };
}

export const injectFactory =
  (token: Syringe.Named) =>
  (target: any, targetKey: any, index?: number | undefined) => {
    const factoryToken = Reflect.getMetadata(AutoFactoryMeta, token);
    inject(factoryToken)(target, targetKey, index);
  };

export const modelFactory = <O extends Syringe.Token<T>, T>(
  option: any,
  modelToken: O,
  ctx: Syringe.Context,
): T => {
  const child = ctx.container.createChild();
  child.register({
    token: AutoFactoryOption,
    useValue: option,
    lifecycle: Syringe.Lifecycle.singleton,
  });
  return child.get(modelToken);
};
