import { BaseView, Slot, singleton, view } from '@difizen/mana-app';
import { forwardRef } from 'react';

import './index.less';

export const AgentBotConfigSlots = {
  headerLeft: 'agent-bot-config-header-left',
  headerRight: 'agent-bot-config-header-right',
  contentLeft: 'agent-bot-config-content-left',
  contentRight: 'agent-bot-config-content-right',
};

const BotConfigComponent = forwardRef<HTMLDivElement>(
  function BotConfigComponent(props, ref) {
    return (
      <div ref={ref} className="bot-config">
        <div className="bot-config-header">
          <label className="bot-config-title">Develop</label>
          <div className="bot-config-header-wrapper">
            <div className="bot-config-header-left">
              <Slot name={AgentBotConfigSlots.headerLeft} />
            </div>
            <div className="bot-config-header-right">
              <Slot name={AgentBotConfigSlots.headerRight} />
            </div>
          </div>
        </div>
        <div className="bot-config-content">
          <div className="bot-config-content-left">
            <Slot name={AgentBotConfigSlots.contentLeft} />
          </div>
          <div className="bot-config-content-right">
            <Slot name={AgentBotConfigSlots.contentRight} />
          </div>
        </div>
      </div>
    );
  },
);

@singleton()
@view('bot-config')
export class BotConfigView extends BaseView {
  override view = BotConfigComponent;
}
