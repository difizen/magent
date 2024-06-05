import { ManaAppPreset, ManaComponents } from '@difizen/mana-app';

import { BotModule } from './module.js';

const LibroExecution = (): JSX.Element => {
  return (
    <div className="magent-bot">
      <ManaComponents.Application
        key="magent-bot"
        asChild={true}
        modules={[ManaAppPreset, BotModule]}
      />
    </div>
  );
};

export default LibroExecution;
