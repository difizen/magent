import { AgentsPageModule, AUDataModule, BaseLayoutModule } from '@difizen/magent-au';
import { ManaAppPreset, ManaComponents, Slot } from '@difizen/mana-app';

const App = (): JSX.Element => {
  return (
    <div className="docs-view docs-agents">
      <ManaComponents.Application
        key="docs-au-agents"
        asChild={true}
        modules={[ManaAppPreset, AUDataModule, BaseLayoutModule, AgentsPageModule]}
        renderChildren
      >
        <Slot name="magent-agents-slot"></Slot>
      </ManaComponents.Application>
    </div>
  );
};

export default App;
