import { ManaAppPreset, ManaComponents } from '@difizen/mana-app';

import { AgentModule } from '../../modules/agent-module.js';
import { AppBaseModule } from '../../modules/app.module.js';

import { BotModule } from './module.js';

const LibroExecution = (): JSX.Element => {
  return (
    <div className="magent-bot">
      <ManaComponents.Application
        key="magent-bot"
        asChild={true}
        modules={[ManaAppPreset, AppBaseModule, BotModule, AgentModule]}
      />
    </div>
  );
};

export default LibroExecution;
