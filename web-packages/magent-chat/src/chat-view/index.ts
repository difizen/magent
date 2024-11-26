export * from './module.js';
export * from './view.js';
export * from './protocol.js';

import { Input } from './components/input/index.js';
import { DefaultMarkdown, ImageModal } from './components/markdown/index.js';
import { TextMessage } from './components/text/index.js';
import { Typing } from './components/typing/index.js';

export const ChatComponents = {
  Input,
  ImageModal,
  Markdown: DefaultMarkdown,
  TextMessage,
  Typing,
};
