import {
  AgentFlowModule,
  AUDataModule,
  MagentMainToolbarView,
  BaseLayoutModule,
} from '@difizen/magent-au';
import {
  createSlotPreference,
  ManaAppPreset,
  ManaComponents,
  ManaModule,
  Slot,
} from '@difizen/mana-app';

import { AgentApp } from './app.js';

const AppModule = ManaModule.create().register(
  AgentApp,
  MagentMainToolbarView,
  createSlotPreference({
    slot: 'flow-control',
    view: MagentMainToolbarView,
  }),
);

const App = (): JSX.Element => {
  return (
    <div className="docs-view docs-chat">
      <ManaComponents.Application
        key="docs-agent-dev"
        asChild={true}
        modules={[
          ManaAppPreset,
          AUDataModule,
          AgentFlowModule,
          AppModule,
          BaseLayoutModule,
        ]}
        renderChildren
      >
        <div className="flow-control">
          <Slot name="flow-control"></Slot>
        </div>
        <Slot name="magent-agent-flow-dev-slot"></Slot>
      </ManaComponents.Application>
    </div>
  );
};

export default App;
