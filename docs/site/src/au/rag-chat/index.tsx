import { AgentChatModule, AUDataModule } from '@difizen/magent-au';
import { ManaAppPreset, ManaComponents, ManaModule, Slot } from '@difizen/mana-app';

import { RagAgentApp } from './app.js';

const AppModule = ManaModule.create().register(RagAgentApp);

const App = (): JSX.Element => {
  return (
    <div className="docs-view docs-chat">
      <ManaComponents.Application
        key="docs-au-rag-chat"
        asChild={true}
        modules={[ManaAppPreset, AUDataModule, AgentChatModule, AppModule]}
        renderChildren
      >
        <Slot name="magent-agent-chat-slot"></Slot>
      </ManaComponents.Application>
    </div>
  );
};

export default App;
