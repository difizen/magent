import {
  KnowledgePageModule,
  AUDataModule,
  BaseLayoutModule,
} from '@difizen/magent-au';
import { ManaAppPreset, ManaComponents, Slot } from '@difizen/mana-app';

const App = (): JSX.Element => {
  return (
    <div className="docs-view docs-agents">
      <ManaComponents.Application
        key="docs-au-plugins"
        asChild={true}
        modules={[ManaAppPreset, AUDataModule, BaseLayoutModule, KnowledgePageModule]}
        renderChildren
      >
        <Slot name="magent-knowledge-slot"></Slot>
      </ManaComponents.Application>
    </div>
  );
};

export default App;
