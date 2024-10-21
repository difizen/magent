import { BaseView, singleton, useInject, view } from '@difizen/mana-app';
import { forwardRef } from 'react';

import { MainView } from '../../common/main-view.js';

import { AULOGO, MagentLOGO } from './logo.js';
import './index.less';

const MagentBrandComponent = forwardRef<HTMLDivElement>(
  function MagentBrandComponent(props, ref) {
    const mainView = useInject(MainView);
    if (mainView.active?.hideBrand) {
      return null;
    }
    return (
      <div ref={ref} className="magent-brand">
        <AULOGO />
        <MagentLOGO />
        {/* <label className="magent-brand-title">Bot</label> */}
      </div>
    );
  },
);

@singleton()
@view('magent-brand')
export class MagentBrandView extends BaseView {
  override view = MagentBrandComponent;
}
