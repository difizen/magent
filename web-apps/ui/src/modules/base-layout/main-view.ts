import { prop } from '@difizen/mana-app';
import { singleton } from '@difizen/mana-app';

import type { NavigatablePage } from './protocol.js';

@singleton()
export class MainView {
  @prop()
  protected _active?: NavigatablePage;

  public get active(): NavigatablePage | undefined {
    return this._active;
  }

  public set active(v: NavigatablePage | undefined) {
    this._active = v;
  }
}
