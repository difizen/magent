import { AgentDevModule, AUDataModule } from '@difizen/magent-au';
import { ManaAppPreset, ManaComponents, ManaModule, Slot } from '@difizen/mana-app';

import { RagAgentApp } from './app.js';

const AppModule = ManaModule.create().register(RagAgentApp);

const App = (): JSX.Element => {
  return (
    <div className="docs-view docs-chat">
      <ManaComponents.Application
        key="docs-agent-dev"
        asChild={true}
        modules={[ManaAppPreset, AUDataModule, AgentDevModule, AppModule]}
        renderChildren
      >
        <Slot name="magent-agent-dev-slot"></Slot>
      </ManaComponents.Application>
    </div>
  );
};

export default App;
