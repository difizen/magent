import type {
  ConversationOption,
  DefaultConversationModel,
} from '@difizen/magent-chat';
import { ConversationManager } from '@difizen/magent-chat';
import type { ToAutoFactory } from '@difizen/magent-core';
import { Fetcher, toAutoFactory } from '@difizen/magent-core';
import { inject, singleton } from '@difizen/mana-app';

import { AUChatService } from '../au-chat-message/chat-service.js';

import type { SessionCreate, SessionOption } from './protocol.js';
import { SessionOptionType } from './protocol.js';
import { SessionModel } from './session-model.js';

@singleton()
export class SessionManager extends ConversationManager<SessionModel> {
  @inject(Fetcher) protected fetcher: Fetcher;
  @inject(AUChatService) protected chatService: AUChatService;
  protected override cache: Map<string, SessionModel> = new Map<string, SessionModel>();

  constructor(
    @inject(toAutoFactory(SessionModel))
    factory: ToAutoFactory<typeof DefaultConversationModel>,
  ) {
    super(factory);
  }

  getSessions = async (agentId: string): Promise<SessionOption[]> => {
    return this.chatService.getConversations({ agentId });
  };

  createSession = async (option: SessionCreate): Promise<SessionOption> => {
    return this.chatService.createConversation(option);
  };

  deleteSession = async (session: SessionModel): Promise<boolean> => {
    const deleted = await this.chatService.deleteConversation(session.option);
    if (deleted) {
      session.dispose();
    }
    return deleted;
  };

  override getOrCreate(opt: ConversationOption) {
    if (SessionOptionType.isOption(opt)) {
      return super.getOrCreate(opt);
    }
    throw Error('invalid agentUniverse session option');
  }
}
