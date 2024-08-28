import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodes } from 'lexical';

import { useEventEmitterContextContext } from '@flow/context/event-emitter.js';

import { textToEditorState } from '../utils.js';

import { CustomTextNode } from './custom-text/node.js';

export const PROMPT_EDITOR_UPDATE_VALUE_BY_EVENT_EMITTER =
  'PROMPT_EDITOR_UPDATE_VALUE_BY_EVENT_EMITTER';
export const PROMPT_EDITOR_INSERT_QUICKLY = 'PROMPT_EDITOR_INSERT_QUICKLY';

type UpdateBlockProps = {
  instanceId?: string;
};
const UpdateBlock = ({ instanceId }: UpdateBlockProps) => {
  const { eventEmitter } = useEventEmitterContextContext();

  const [editor] = useLexicalComposerContext();

  eventEmitter?.useSubscription((v: any) => {
    if (
      v.type === PROMPT_EDITOR_UPDATE_VALUE_BY_EVENT_EMITTER &&
      v.instanceId === instanceId
    ) {
      const editorState = editor.parseEditorState(textToEditorState(v.payload));
      editor.setEditorState(editorState);
    }
  });

  eventEmitter?.useSubscription((v: any) => {
    if (v.type === PROMPT_EDITOR_INSERT_QUICKLY && v.instanceId === instanceId) {
      editor.focus();
      editor.update(() => {
        const textNode = new CustomTextNode('/');
        $insertNodes([textNode]);
      });
    }
  });

  return null;
};

export default UpdateBlock;
