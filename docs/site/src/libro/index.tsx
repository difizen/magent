import { ChatView } from '@difizen/magent-chat';
import { LibroChatModule } from '@difizen/magent-libro';
import {
  createViewPreference,
  ManaAppPreset,
  ManaComponents,
  ManaModule,
  RootSlotId,
} from '@difizen/mana-app';

const AppModule = ManaModule.create().register(
  createViewPreference({
    view: ChatView,
    options: { id: '1', chat_key: 'LLM:chatgpt' },
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
        modules={[ManaAppPreset, LibroChatModule, AppModule]}
      />
    </div>
  );
};

export default App;
