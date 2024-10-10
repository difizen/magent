import { ChatModule, ChatService, ChatView } from '@difizen/magent-chat';
import {
  createViewPreference,
  ManaAppPreset,
  ManaComponents,
  ManaModule,
  RootSlotId,
  Syringe,
} from '@difizen/mana-app';

import { MockChatService } from './mock-chat-service.js';

const AppModule = ManaModule.create().register(
  {
    token: ChatService,
    useClass: MockChatService,
    lifecycle: Syringe.Lifecycle.singleton,
  },
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
        modules={[ManaAppPreset, ChatModule, AppModule]}
      />
    </div>
  );
};

export default App;
