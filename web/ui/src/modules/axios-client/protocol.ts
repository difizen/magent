import { Syringe } from '@difizen/mana-app';
import type { AxiosStatic } from 'axios';

export type AxiosClient = AxiosStatic;
export const AxiosClient = Syringe.defineToken('AxiosClient', { multiple: false });
