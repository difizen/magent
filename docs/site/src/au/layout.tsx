import { BaseLayoutModule } from '@difizen/magent-au';
import { ManaAppPreset, ManaComponents, Slot } from '@difizen/mana-app';

const App = (): JSX.Element => {
  return (
    <div className="docs-view">
      <ManaComponents.Application
        key="docs-au-layout"
        asChild={true}
        modules={[ManaAppPreset, BaseLayoutModule]}
        renderChildren
      >
        <Slot name="magent-base-layout-slot"></Slot>
      </ManaComponents.Application>
    </div>
  );
};

export default App;
