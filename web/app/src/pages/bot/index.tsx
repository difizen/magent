import { ManaAppPreset, ManaComponents } from '@difizen/mana-app';

import { BotModule } from './module.js';
import { AppBaseModule } from '../../modules/app.module.js';

const LibroExecution = (): JSX.Element => {
  return (
    <div className="magent-bot">
      <ManaComponents.Application
        key="magent-bot"
        asChild={true}
        modules={[ManaAppPreset, AppBaseModule, BotModule]}
      />
    </div>
  );
};

export default LibroExecution;
