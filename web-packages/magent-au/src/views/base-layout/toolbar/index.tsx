import { BaseView, singleton, ToolbarRender, useInject, view } from '@difizen/mana-app';
import { forwardRef } from 'react';

import { MainView } from '../../common/main-view.js';

import './index.less';

const viewId = 'magent-main-toolbar';

const MagentMainToolbarComponent = forwardRef<HTMLDivElement>(
  function MagentMainToolbarComponent(props, ref) {
    const mainView = useInject(MainView);

    return (
      <div className={viewId} ref={ref}>
        <ToolbarRender data={mainView} />
      </div>
    );
  },
);

@singleton()
@view(viewId)
export class MagentMainToolbarView extends BaseView {
  override view = MagentMainToolbarComponent;
}
