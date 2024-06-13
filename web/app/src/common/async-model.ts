import { Deferred, injectable } from '@difizen/mana-app';

@injectable()
export abstract class AsyncModel<T = any, O = any> {
  ready: Promise<T>;
  protected readyDeferred: Deferred<T> = new Deferred<T>();

  initialize(option: O) {
    if (this.shouldInitFromMeta(option)) {
      this.fromMeta(option);
    } else {
      this.fetchInfo(option);
    }
  }

  abstract shouldInitFromMeta(option: O): boolean;

  protected fromMeta(option: O) {
    this.readyDeferred.resolve(this as unknown as T);
  }

  abstract fetchInfo(option: O): Promise<void>;
}
