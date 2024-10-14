import type { ToAutoFactory } from '@difizen/magent-core';
import { toAutoFactory } from '@difizen/magent-core';
import { Fetcher } from '@difizen/magent-core';
import { inject, singleton } from '@difizen/mana-app';

import type { APISession, SessionCreate, SessionOption } from './protocol.js';
import { toSessionOption } from './protocol.js';
import { SessionModel } from './session-model.js';

@singleton()
export class SessionManager {
  @inject(toAutoFactory(SessionModel))
  declare factory: ToAutoFactory<typeof SessionModel>;

  @inject(Fetcher) fetcher: Fetcher;
  protected cache: Map<string, SessionModel> = new Map<string, SessionModel>();

  getSessions = async (agentId: string): Promise<SessionOption[]> => {
    const res = await this.fetcher.get<APISession[]>(`/api/v1/sessions`, {
      agent_id: agentId,
    });
    if (res.status !== 200) {
      throw new Error('Create session failed');
    }
    return res.data.map(toSessionOption);
  };

  createSession = async (option: SessionCreate): Promise<SessionOption> => {
    const res = await this.fetcher.post<APISession>(`/api/v1/sessions`, {
      agent_id: option.agentId,
    });
    if (res.status !== 200) {
      throw new Error('Create session failed');
    }
    return toSessionOption(res.data);
  };

  deleteSession = async (session: SessionModel): Promise<boolean> => {
    const res = await this.fetcher.delete<APISession>(`/api/v1/sessions/${session.id}`);
    if (res.status !== 200) {
      return false;
    }
    session.dispose();
    return true;
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
