import { BaseView, singleton, view } from '@difizen/mana-app';
import { Input } from 'antd';
import { forwardRef } from 'react';

import './index.less';

const BotConfigComponent = forwardRef<HTMLDivElement>(
  function BotConfigComponent(props, ref) {
    return (
      <div ref={ref} className="bot-config">
        <div className="bot-config-header">
          <label className="bot-config-label">Develop</label>
        </div>
        <div className="bot-config-content">
          <div className="bot-config-content-left">
            <Input.TextArea className="bot-config-persona-input" />
          </div>
          <div className="bot-config-content-right"></div>
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
