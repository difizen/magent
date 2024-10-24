import { PluginsPageModule, AUDataModule, BaseLayoutModule } from '@difizen/magent-au';
import { ManaAppPreset, ManaComponents, Slot } from '@difizen/mana-app';

const App = (): JSX.Element => {
  return (
    <div className="docs-view docs-agents">
      <ManaComponents.Application
        key="docs-au-plugins"
        asChild={true}
        modules={[ManaAppPreset, AUDataModule, BaseLayoutModule, PluginsPageModule]}
        renderChildren
      >
        <Slot name="magent-plugins-slot"></Slot>
      </ManaComponents.Application>
    </div>
  );
};

export default App;
