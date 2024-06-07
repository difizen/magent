import { BaseView, singleton, view } from '@difizen/mana-app';
import { forwardRef } from 'react';

import './index.less';

const BotPreviewerComponent = forwardRef<HTMLDivElement>(
  function BotPreviewerComponent(props, ref) {
    return (
      <div ref={ref} className="bot-previewer">
        <div className="bot-previewer-header">
          <label className="bot-config-label">Preview</label>
        </div>
        <div className="bot-previewer-content"></div>
      </div>
    );
  },
);

@singleton()
@view('bot-previewer')
export class BotPreviewerView extends BaseView {
  override view = BotPreviewerComponent;
}
