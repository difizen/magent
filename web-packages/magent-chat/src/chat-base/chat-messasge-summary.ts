import type { ToAutoFactory } from '@difizen/magent-core';
import { AutoFactoryOption } from '@difizen/magent-core';
import { autoFactory, toAutoFactory } from '@difizen/magent-core';
import { inject, prop, singleton } from '@difizen/mana-app';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

export interface ITokenSummary {
  completion_tokens?: number;
  prompt_tokens?: number;
  total_tokens?: number;
  start_time?: string;
  end_time?: string;
  response_time?: number;
}
@autoFactory()
export class DefaultChatMessageSummary {
  constructor(@inject(AutoFactoryOption) option: ITokenSummary) {
    this.fromMeta(option);
  }

  fromMeta(option: ITokenSummary) {
    if (option.completion_tokens !== undefined) {
      this.completionTokens = option.completion_tokens;
    }
    if (option.prompt_tokens !== undefined) {
      this.promptTokens = option.prompt_tokens;
    }
    if (option.total_tokens !== undefined) {
      this.totalTokens = option.total_tokens;
    }
    if (option.start_time !== undefined) {
      this.startTime = dayjs(option.start_time);
    }
    if (option.end_time !== undefined) {
      this.endTime = dayjs(option.end_time);
    }
    if (option.response_time !== undefined) {
      this.responseTime = option.response_time;
    }
  }
  /**
   * token usage for completion
   */
  @prop()
  completionTokens: number;

  /**
   * token usage for prompt input
   */
  @prop()
  promptTokens: number;

  /**
   * total token usage
   */
  @prop()
  totalTokens: number;

  /**
   * the time chat started
   */
  @prop()
  startTime?: Dayjs;

  /**
   * the time chat ended
   */
  @prop()
  endTime?: Dayjs;

  /**
   * the time chat ended
   */
  @prop()
  responseTime?: number;
}

@singleton()
export class ChatMessageSummaryProvider {
  @inject(toAutoFactory(DefaultChatMessageSummary))
  protected tokenSummaryFactory: ToAutoFactory<typeof DefaultChatMessageSummary>;

  create(opt: ITokenSummary) {
    return this.tokenSummaryFactory(opt);
  }
}
