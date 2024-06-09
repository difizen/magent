import { Syringe } from '@difizen/mana-app';

import type { Model } from './model';

export interface ModelMeta {
  key: string;
  name: string;
  icon: string;
}

export interface ModelConfigMeta {
  [key: string]: any;
}

export type ModelFactory = (option: ModelMeta) => Model;
export const ModelFactory = Syringe.defineToken('ModelFactory');

export const ModelOption = Syringe.defineToken('ModelOption', { multiple: false });
