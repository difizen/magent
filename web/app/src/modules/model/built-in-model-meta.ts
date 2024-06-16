import type { ModelMeta } from './protocol.js';

const gpt4: ModelMeta = {
  key: 'gpt-4',
  name: 'gpt-4',
  icon: 'https://static.intercomassets.com/avatars/7363200/square_128/AI-1715100858.png',
};
const gpt4o: ModelMeta = {
  key: 'gpt-4o',
  name: 'gpt-4o',
  icon: 'https://static.intercomassets.com/avatars/7363200/square_128/AI-1715100858.png',
};

export const builtinModels = [gpt4, gpt4o];
