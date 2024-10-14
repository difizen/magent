import { AsyncModel, Fetcher } from '@difizen/magent-core';
import { inject, prop, transient } from '@difizen/mana-app';

import { KnowledgeModelOption } from './protocol.js';
import { KnowledgeModelType } from './protocol.js';

@transient()
export class KnowledgeModel extends AsyncModel<KnowledgeModel, KnowledgeModelOption> {
  fetcher: Fetcher;

  id: string;

  @prop()
  nickname: string;
  @prop()
  avatar?: string;
  @prop()
  description: string;
  @prop()
  parameters: string[] = [];

  option: KnowledgeModelOption;

  constructor(
    @inject(KnowledgeModelOption) option: KnowledgeModelOption,
    @inject(Fetcher) fetcher: Fetcher,
  ) {
    super();
    this.option = option;
    this.fetcher = fetcher;

    this.id = option.id;
    this.initialize(option);
  }

  shouldInitFromMeta(): boolean {
    return true;
  }

  updateOption(option: KnowledgeModelOption) {
    // TODO:
  }

  protected override fromMeta(option: KnowledgeModelOption = this.option) {
    this.id = option.id;
    this.nickname = option.nickname;
    this.avatar = option.avatar;
    this.description = option.description;
    if (KnowledgeModelType.isFullOption(option)) {
      super.fromMeta(option);
    }
  }

  async fetchInfo(option: KnowledgeModelOption = this.option) {
    const res = await this.fetcher.get<KnowledgeModelOption>(
      `api/v1/tools/${option.id}`,
    );
    if (res.status === 200) {
      this.fromMeta(res.data);
    }
  }

  toMeta(): KnowledgeModelOption {
    return {
      id: this.id,
      nickname: this.nickname,
      description: this.description,
      avatar: this.avatar,
    };
  }
  toJSON(): string {
    return JSON.stringify(this.toMeta());
  }
}
