import { BaseView, singleton, useInject, view } from '@difizen/mana-app';
import { forwardRef } from 'react';

import { MainView } from '../../common/main-view.js';

import './index.less';

const MagentMainTitleComponent = forwardRef<HTMLDivElement>(
  function MagentMainTitleComponent(props, ref) {
    const mainView = useInject(MainView);
    if (mainView.active) {
      const content = mainView.active.pageTitle();
      if (content) {
        return (
          <div ref={ref} className={viewId}>
            {content}
          </div>
        );
      }
    }
    return null;
  },
);

export const viewId = 'magent-main-title';

@singleton()
@view(viewId)
export class MagentMainTitleView extends BaseView {
  override view = MagentMainTitleComponent;
}
