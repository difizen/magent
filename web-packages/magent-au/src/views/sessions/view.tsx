import { PlusOutlined } from '@ant-design/icons';
import {
  BaseView,
  ViewInstance,
  inject,
  useInject,
  view,
  prop,
  transient,
  ViewOption,
  Deferred,
} from '@difizen/mana-app';
import { Button } from 'antd';
import classNames from 'classnames';
import { forwardRef, useMemo } from 'react';

import { SessionManager } from '../../session/session-manager.js';
import type { SessionModel } from '../../session/session-model.js';

import { ConversationItem } from './conversation-list/index.js';

import './index.less';

const viewId = 'magent-sessions';

function isYesterday(inputDateStr: string) {
  // 创建一个新的Date对象表示当前日期
  const today = new Date();

  // 设置时间为昨天（减去一天）
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // 创建一个Date对象表示输入的日期
  const inputDate = new Date(inputDateStr);

  // 比较年、月、日是否相同
  return (
    inputDate.getFullYear() === yesterday.getFullYear() &&
    inputDate.getMonth() === yesterday.getMonth() &&
    inputDate.getDate() === yesterday.getDate()
  );
}

const getDisplayMessageList = (sessions: SessionModel[], nowDate: string) => {
  let sameDay = false;
  let currentDate = nowDate;

  return sessions.map((session, idx) => {
    if (!session) {
      return null;
    }

    const date = session.gmtCreate ? session.gmtCreate.format('YYYY-MM-DD') : '';

    if (date === currentDate) {
      sameDay = true;
    } else {
      sameDay = false;
      currentDate = date;
    }

    return (
      <div key={`${session.id}`}>
        {(idx === 0 || !sameDay) && (
          <span
            className={classNames(
              'chat-histroy-date',
              idx === 0 ? 'chat-histroy-firstConv' : '',
            )}
          >
            {date === nowDate ? '今日' : isYesterday(date) ? '昨日' : date}
          </span>
        )}
        <ConversationItem session={session} />
      </div>
    );
  });
};

const SessionsViewComponent = forwardRef<HTMLDivElement>(
  function SessionsViewComponent(props, ref) {
    const instance = useInject<SessionsView>(ViewInstance);

    const nowDate = useMemo(() => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();

      const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${
        day < 10 ? '0' + day : day
      }`;

      return formattedDate;
    }, []);

    return (
      <div
        style={{ minHeight: 42 * Math.min(instance.sessions.length, 6) + 60 }}
        className={'chat-histroy-list'}
      >
        <Button
          icon={<PlusOutlined className={'chat-histroy-icon'} />}
          // loading={sessionSnap.convCreating}
          onClick={instance.createSession}
        >
          开启新会话
        </Button>
        <div className={'chat-histroy-scroll'}>
          {getDisplayMessageList(instance.sessions, nowDate)}
        </div>
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

  initializing?: Promise<void>;
  defaultSessionCreating?: Promise<void>;
  ready: Promise<void>;
  protected readyDeferred: Deferred<void> = new Deferred();

  constructor(@inject(ViewOption) option: SessionsViewOption) {
    super();
    this.option = option;
    this.agentId = option.agentId;
    this.ready = this.readyDeferred.promise;
  }

  protected initSessions = async () => {
    await this.updateSessions();
    this.readyDeferred.resolve();
  };

  protected updateSessions = async () => {
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
  };

  override async onViewMount(): Promise<void> {
    this.ensureActive();
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

  ensureInitialized = async () => {
    if (!this.initializing) {
      this.initializing = this.ready;
      this.initSessions();
    }
    return this.initializing;
  };

  ensureActive = async () => {
    await this.ensureInitialized();
    await this.ready;
    if (!this.active) {
      if (!this.defaultSessionCreating) {
        this.defaultSessionCreating = this.createSession();
      }
      return await this.defaultSessionCreating;
    }
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
