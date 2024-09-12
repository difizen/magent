import { ManaAppPreset, ManaComponents } from '@difizen/mana-app';
import { useParams } from 'umi';

import { AgentModule } from '../../modules/agent-module.js';
import { AppBaseModule } from '../../modules/app.module.js';

import { BotModule } from './module.js';

const LibroExecution = (): JSX.Element => {
  const { botId } = useParams();
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
