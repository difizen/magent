export * from './module.js';
export * from './view.js';

import { Input } from './components/input/index.js';
import { Markdown } from './components/markdown/index.js';
import { TextMessage } from './components/text/index.js';
import { Typing } from './components/typing/index.js';

export const ChatComponents = {
  Input,
  Markdown,
  TextMessage,
  Typing,
};
