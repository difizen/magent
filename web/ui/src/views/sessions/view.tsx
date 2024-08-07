import { CloseOutlined } from '@ant-design/icons';
import {
  BaseView,
  ViewInstance,
  inject,
  useInject,
  view,
  prop,
  transient,
  ViewOption,
} from '@difizen/mana-app';
import { Button } from 'antd';
import { forwardRef } from 'react';

import type { SessionModel } from '../../modules/session/index.js';
import { SessionManager } from '../../modules/session/index.js';
import './index.less';

const viewId = 'magent-sessions';

const SessionsViewComponent = forwardRef<HTMLDivElement>(
  function SessionsViewComponent(props, ref) {
    const instance = useInject<SessionsView>(ViewInstance);

    return (
      <div ref={ref} className={viewId}>
        {instance.sessions.map((session) => (
          <div onClick={() => instance.selectSession(session)} key={session.id}>
            {session.id}
            <CloseOutlined onClick={() => instance.deleteSession(session)} />
          </div>
        ))}
        <Button onClick={instance.createSession}>开启新会话</Button>
      </div>
    );
  },
);

export interface SessionsViewOption {
  agentId: string;
}
@transient()
@view(viewId)
export class SessionsView extends BaseView {
  @inject(SessionManager) sessionManager: SessionManager;

  @prop()
  loadig = false;

  @prop()
  sessions: SessionModel[] = [];

  @prop()
  active?: SessionModel;

  override view = SessionsViewComponent;

  agentId: string;

  option: SessionsViewOption;

  constructor(@inject(ViewOption) option: SessionsViewOption) {
    super();
    this.option = option;
    this.agentId = option.agentId;
  }

  override async onViewMount(): Promise<void> {
    this.loadig = true;
    const sessions = await this.sessionManager.getSessions(this.agentId);
    this.sessions = sessions.map((opt) => {
      const session = this.sessionManager.getOrCreateSession(opt);
      session.onDispose(() => this.disposeSession(session));
      return session;
    });
    if (!this.active) {
      this.active = this.sessions[0];
    }
    this.loadig = false;
  }

  selectSession = (session: SessionModel) => {
    this.active = session;
  };

  createSession = async () => {
    const opt = await this.sessionManager.createSession({ agentId: this.agentId });
    const session = this.sessionManager.getOrCreateSession(opt);
    session.onDispose(() => this.disposeSession(session));
    this.sessions.unshift(session);
    this.active = session;
  };

  protected disposeSession = (session: SessionModel) => {
    const sessions = this.sessions.filter((i) => i.id !== session.id);
    if (this.active?.id === session.id) {
      if (sessions.length > 0) {
        this.active = sessions[0];
      } else {
        this.active = undefined;
      }
    }
    this.sessions = sessions;
  };

  deleteSession = async (session: SessionModel) => {
    await this.sessionManager.deleteSession(session);
  };
}
