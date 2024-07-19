import { inject, prop, singleton } from '@difizen/mana-app';

import { DeferredModel } from '../../common/async-model.js';
import { defaultAgentBotMeta } from '../../constant/default.js';
import type { AgentBot } from '../../modules/agent-bot/index.js';
import { AgentBotManager } from '../../modules/agent-bot/index.js';
import { PluginConfigManager, PluginManager } from '../../modules/plugin/index.js';

@singleton()
export class BotProvider extends DeferredModel<AgentBot> {
  @inject(AgentBotManager) agentBotManager: AgentBotManager;
  @inject(PluginManager) pluginManager: PluginManager;
  @inject(PluginConfigManager) pluginConfigManager: PluginConfigManager;

  @prop()
  _current?: AgentBot;

  get current() {
    return this._current;
  }
  set current(v: AgentBot | undefined) {
    this._current = v;
    if (v) {
      this.readyDeferred.resolve(v);
    } else {
      this.readyDeferred.reject(new Error('Cannot init curernt bot'));
    }
  }

  @prop()
  loading = false;

  async init(botId: number) {
    this.loading = true;
    if (!botId) {
      const page = await this.agentBotManager.getMyBots();
      const meta = page.items[0];
      // const pluginPage = await this.pluginManager.getPlugins();
      // const pluginPage = await this.pluginManager.getPlugins();
      // const plugin = pluginPage.items[0];
      if (!meta) {
        this.current = await this.agentBotManager.createBot(defaultAgentBotMeta);
      } else {
        this.current = await this.agentBotManager.getBot(meta);
      }
      // this.current.draftReady.then(() => {
      //   if (this.current.draft) {
      //     this.current.draft.plugins = [{ key: plugin.id.toString() }];
      //   }
      // });
    } else {
      this.current = await this.agentBotManager.getBot({ id: botId });
    }
    this.loading = false;
  }
}
