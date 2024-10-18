import type { ToAutoFactory } from '@difizen/magent-core';
import { toAutoFactory } from '@difizen/magent-core';
import { Fetcher } from '@difizen/magent-core';
import { inject, singleton } from '@difizen/mana-app';

import { AUChatService } from '../au-chat-message/chat-service.js';

import type { SessionCreate, SessionOption } from './protocol.js';
import { SessionModel } from './session-model.js';

@singleton()
export class SessionManager {
  @inject(toAutoFactory(SessionModel))
  declare factory: ToAutoFactory<typeof SessionModel>;

  @inject(Fetcher) fetcher: Fetcher;
  @inject(AUChatService) chatService: AUChatService;
  protected cache: Map<string, SessionModel> = new Map<string, SessionModel>();

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

  getOrCreateSession = (option: SessionOption): SessionModel => {
    const currentOption = option;
    if (!currentOption.id) {
      throw new Error('Missing id property in session option');
    }
    const exist = this.cache.get(currentOption.id);
    if (exist) {
      return exist;
    }
    const session = this.factory(currentOption);
    session.onDispose(() => {
      this.cache.delete(currentOption.id);
    });
    this.cache.set(currentOption.id, session);
    return session;
  };
}
