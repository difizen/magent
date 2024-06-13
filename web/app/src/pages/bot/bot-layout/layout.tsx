import { singleton, Slot, useInject, view } from '@difizen/mana-app';
import { BaseView } from '@difizen/mana-app';
import { BoxPanel } from '@difizen/mana-react';
import { Spin } from 'antd';
import { forwardRef, useEffect } from 'react';
import { useParams } from 'umi';

import './index.less';
import { BotProvider } from '../bot-provider.js';

export const BotLayoutSlots = {
  config: 'magent-bot-layout-config',
  preview: 'magent-bot-layout-preview',
};

export const BotLayoutComponent = forwardRef(function MagentBotLayoutComponent() {
  const { botId } = useParams();
  const botProvider = useInject(BotProvider);

  useEffect(() => {
    botProvider.init(botId);
  }, [botId, botProvider]);

  return (
    <div className="magent-bot-layout">
      {botProvider.loading ? (
        <Spin spinning={botProvider.loading}></Spin>
      ) : (
        <BoxPanel direction="left-to-right">
          <BoxPanel.Pane className="magent-bot-layout-config" flex={1}>
            <Slot name={BotLayoutSlots.config} />
          </BoxPanel.Pane>
          <BoxPanel.Pane className="magent-bot-layout-preview">
            <Slot name={BotLayoutSlots.preview} />
          </BoxPanel.Pane>
        </BoxPanel>
      )}
    </div>
  );
});

@singleton()
@view('bot-layout')
export class BotLayoutView extends BaseView {
  override view = BotLayoutComponent;
}
