import { autoFactory } from '@difizen/magent-core';
import { prop } from '@difizen/mana-app';
import type { Dayjs } from 'dayjs';

@autoFactory()
export class DefaultChatMessageSummary {
  /**
   * token usage for completion
   */
  @prop()
  completion_tokens: number;

  /**
   * token usage for prompt input
   */
  @prop()
  prompt_tokens: number;

  /**
   * total token usage
   */
  @prop()
  total_tokens: number;

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
