import {
  BaseView,
  ViewInstance,
  inject,
  singleton,
  useInject,
  view,
} from '@difizen/mana-app';
import { Input } from 'antd';
import type { ChangeEvent } from 'react';
import { forwardRef } from 'react';

import './index.less';
import { BotProvider } from '../bot-provider.js';

const viewId = 'bot-config-persona';

const BotPersonaComponent = forwardRef<HTMLDivElement>(
  function BotPersonaComponent(props, ref) {
    const instance = useInject<BotPersonaView>(ViewInstance);
    const botProvider = useInject(BotProvider);
    const config = botProvider.current?.draft;

    return (
      <div ref={ref} className={viewId}>
        <div className={`${viewId}-header`}>
          <label>人设与回复逻辑</label>
        </div>
        <Input.TextArea
          rootClassName={`${viewId}-textarea`}
          onChange={instance.onTextChange}
          value={config?.persona}
          placeholder="使用自然语言填写 Bot 人物人设、功能和工作流程"
        />
      </div>
    );
  },
);

@singleton()
@view(viewId)
export class BotPersonaView extends BaseView {
  @inject(BotProvider) botProvider: BotProvider;
  override view = BotPersonaComponent;

  onTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const draft = this.botProvider.current?.draft;
    if (draft) {
      draft.persona = e.target.value;
    }
  };
}
