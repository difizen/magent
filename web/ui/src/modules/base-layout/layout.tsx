import { singleton, Slot, view } from '@difizen/mana-app';
import { BaseView } from '@difizen/mana-app';
import { BoxPanel } from '@difizen/mana-react';
import type { ReactNode } from 'react';
import { forwardRef } from 'react';

import './index.less';

export const MagentBaseLayoutSlots = {
  header: 'magent-base-layout-header',
  content: 'magent-base-layout-content',
};

interface Props {
  children?: ReactNode;
}

export const slot = 'magent-base-layout-slot';

export const MagentBaseLayoutComponent = forwardRef<HTMLDivElement, Props>(
  function LibroExecutionLayoutComponent(props, ref) {
    return (
      <div ref={ref} className="magent-base-layout">
        <BoxPanel direction="top-to-bottom">
          <BoxPanel.Pane className="magent-base-layout-header">
            <Slot name={MagentBaseLayoutSlots.header} />
          </BoxPanel.Pane>
          <BoxPanel.Pane className="magent-base-layout-container" flex={1}>
            {props.children ? (
              props.children
            ) : (
              <Slot name={MagentBaseLayoutSlots.content} />
            )}
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
