import { BaseView, singleton, view } from '@difizen/mana-app';
import { forwardRef } from 'react';

import { MagentLOGO } from './logo.js';
import './index.less';

const MagentBrandComponent = forwardRef<HTMLDivElement>(
  function MagentBrandComponent(props, ref) {
    return (
      <div ref={ref} className="magent-brand">
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
