import { singleton } from '@difizen/mana-app';
import type { BrowserHistory, To } from 'history';
import { createBrowserHistory } from 'history';

@singleton()
export class RouterHistory {
  protected browserHistory: BrowserHistory = createBrowserHistory();
  push = (to: To, state?: any) => {
    this.browserHistory.push(to, state);
  };
}
