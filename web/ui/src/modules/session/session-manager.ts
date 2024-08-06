import { inject, singleton } from '@difizen/mana-app';
import qs from 'query-string';

import { AxiosClient } from '../axios-client/index.js';

import type {
  APISession,
  SessionCreate,
  SessionModel,
  SessionOption,
} from './protocol.js';
import { toSessionOption } from './protocol.js';
import { SessionFactory } from './protocol.js';

@singleton()
export class SessionManager {
  @inject(AxiosClient) axios: AxiosClient;
  @inject(SessionFactory) factory: SessionFactory;
  protected cache: Map<string, SessionModel> = new Map<string, SessionModel>();

  getSessions = async (agentId: string): Promise<SessionOption[]> => {
    const query = qs.stringify({
      agent_id: agentId,
    });
    const res = await this.axios.get<APISession[]>(`/api/v1/sessions?${query}`);
    if (res.status !== 200) {
      throw new Error('Create session failed');
    }
    return res.data.map(toSessionOption);
  };

  createSession = async (option: SessionCreate): Promise<SessionOption> => {
    const res = await this.axios.post<APISession>(`/api/v1/sessions`, {
      agent_id: option.agentId,
    });
    if (res.status !== 200) {
      throw new Error('Create session failed');
    }
    return toSessionOption(res.data);
  };

  deleteSession = async (session: SessionModel): Promise<boolean> => {
    const res = await this.axios.delete<APISession>(`/api/v1/sessions/${session.id}`);
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
