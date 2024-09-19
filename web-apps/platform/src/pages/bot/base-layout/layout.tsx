import { singleton, Slot, view } from '@difizen/mana-app';
import { BaseView } from '@difizen/mana-app';
import { BoxPanel } from '@difizen/mana-react';
import { forwardRef } from 'react';

import './index.less';

export const MagentBaseLayoutSlots = {
  header: 'magent-base-layout-header',
  content: 'magent-base-layout-content',
};

export const MagentBaseLayoutComponent = forwardRef(
  function MagentBaseLayoutComponent() {
    return (
      <div className="magent-base-layout">
        <BoxPanel direction="top-to-bottom">
          <BoxPanel.Pane className="magent-base-layout-header">
            <Slot name={MagentBaseLayoutSlots.header} />
          </BoxPanel.Pane>
          <BoxPanel.Pane className="magent-base-layout-container" flex={1}>
            <Slot name={MagentBaseLayoutSlots.content} />
          </BoxPanel.Pane>
        </BoxPanel>
      </div>
    );
  },
);

@singleton()
@view('magent-base-layout')
export class MagentBaseLayoutView extends BaseView {
  override view = MagentBaseLayoutComponent;
}
