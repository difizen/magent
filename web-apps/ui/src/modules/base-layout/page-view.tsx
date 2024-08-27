import { BaseView, inject } from '@difizen/mana-app';
import type { ReactNode } from 'react';

import { MainView } from './main-view.js';
import type { NavigatablePage } from './protocol.js';

export class PageView extends BaseView implements NavigatablePage {
  @inject(MainView) protected mainView: MainView;

  override onViewUnmount(): void {
    this.mainView.active = undefined;
  }
  override onViewMount(): void {
    this.mainView.active = this;
  }

  goBack: () => void;
  pageTitle: () => ReactNode;
}
