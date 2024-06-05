import { singleton, Slot, view } from '@difizen/mana-app';
import { BaseView } from '@difizen/mana-app';
import { BoxPanel } from '@difizen/mana-react';
import { forwardRef } from 'react';

import './index.less';

export const BotLayoutSlots = {
  config: 'magent-bot-layout-config',
  preview: 'magent-bot-layout-preview',
};

export const BotLayoutComponent = forwardRef(function MagentBotLayoutComponent() {
  return (
    <div className="magent-bot-layout">
      <BoxPanel direction="left-to-right">
        <BoxPanel.Pane className="magent-bot-layout-config" flex={1}>
          <Slot name={BotLayoutSlots.config} />
        </BoxPanel.Pane>
        <BoxPanel.Pane className="magent-bot-layout-preview">
          <Slot name={BotLayoutSlots.preview} />
        </BoxPanel.Pane>
      </BoxPanel>
    </div>
  );
});

@singleton()
@view('bot-layout')
export class BotLayoutView extends BaseView {
  override view = BotLayoutComponent;
}
