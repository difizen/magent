import { ManaModule } from '@difizen/mana-app';
import { UserModule } from './user/module.js';

export const AppBaseModule = new ManaModule().dependOn(UserModule);
