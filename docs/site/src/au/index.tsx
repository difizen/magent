import { AUModule } from '@difizen/magent-au';
import { ChatView } from '@difizen/magent-chat';
import {
  createViewPreference,
  ManaAppPreset,
  ManaComponents,
  ManaModule,
  RootSlotId,
} from '@difizen/mana-app';
import './index.less';

const AppModule = ManaModule.create().register(
  createViewPreference({
    view: ChatView,
    options: { id: '1' },
    autoCreate: true,
    slot: RootSlotId,
  }),
);

const App = (): JSX.Element => {
  return (
    <div className="magent-chat">
      <ManaComponents.Application
        key="magent-bot"
        asChild={true}
        modules={[ManaAppPreset, AUModule, AppModule]}
      />
    </div>
  );
};

export default App;
