import { inject, prop, transient } from '@difizen/mana-app';

import { ModelOption, type ModelConfigMeta, type ModelMeta } from './protocol';

@transient()
export class Model {
  key: string;
  name: string;
  icon: string;

  @prop()
  config: ModelConfigMeta;

  protected configStr: string;

  constructor(@inject(ModelOption) meta: ModelMeta) {
    this.key = meta.key;
    this.name = meta.name;
    this.icon = meta.icon;
  }
}
