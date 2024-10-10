import type { Newable } from '@difizen/mana-app';
import { transient } from '@difizen/mana-app';
import { inject } from '@difizen/mana-app';
import { registerSideOption } from '@difizen/mana-app';
import { Syringe } from '@difizen/mana-app';

export const AutoFactoryOption = Syringe.defineToken('AutoFactoryOption');
export const AutoFactoryMeta = Syringe.defineToken('AutoFactoryMeta', {
  multiple: false,
});

// export const AutoFactory = Syringe.defineToken('AutoFactory', { multiple: false });
// export type AutoFactory = <T>(token: Newable<T>) => (...args: any[]) => T;

export function autoFactory<T = any>() {
  return (target: Newable<T>): void => {
    const AutoFactoryToken = Symbol();
    Reflect.defineMetadata(AutoFactoryMeta, AutoFactoryToken, target);
    transient()(target);

    // registerSideOption(
    //   {
    //     token: AutoFactory,
    //     useFactory: (ctx: Syringe.Context) => {
    //       return (token: Newable<T>) => {
    //         const factoryToken = Reflect.getMetadata(AutoFactoryMeta, token);
    //         const factory = ctx.container.get<(...args: any[]) => T>(factoryToken);
    //         return (...args: any[]): T => {
    //           return factory(...args);
    //         };
    //       };
    //     },
    //   },
    //   target,
    // );

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

export type ToAutoFactory<T extends Newable<any>> = (
  option: ConstructorParameters<T>[0],
) => InstanceType<T>;

export const toAutoFactory = <T extends Newable<any>>(
  target: T,
): Syringe.Token<(...args: ConstructorParameters<T>) => InstanceType<T>> => {
  const factoryToken = Reflect.getOwnMetadata(AutoFactoryMeta, target);
  if (!factoryToken) {
    throw new Error(`Cannot find factory token for ${target.constructor.name}`);
  }
  return factoryToken;
};

export const injectFactory =
  <T extends Newable<any>>(token: T) =>
  (target: any, targetKey: any, index?: number | undefined) => {
    const factoryToken = toAutoFactory(token);
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
