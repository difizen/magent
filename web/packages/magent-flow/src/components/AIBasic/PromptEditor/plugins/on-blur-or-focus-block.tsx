import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  BLUR_COMMAND,
  COMMAND_PRIORITY_EDITOR,
  FOCUS_COMMAND,
  KEY_ESCAPE_COMMAND,
} from 'lexical';
import type { FC } from 'react';
import { useEffect, useRef } from 'react';

type OnBlurBlockProps = {
  onBlur?: () => void;
  onFocus?: () => void;
};
const OnBlurBlock: FC<OnBlurBlockProps> = ({ onBlur, onFocus }) => {
  const [editor] = useLexicalComposerContext();

  const ref = useRef<any>(null);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        BLUR_COMMAND,
        () => {
          ref.current = setTimeout(() => {
            editor.dispatchCommand(
              KEY_ESCAPE_COMMAND,
              new KeyboardEvent('keydown', { key: 'Escape' }),
            );
          }, 200);

          if (onBlur) {
            onBlur();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        FOCUS_COMMAND,
        () => {
          if (onFocus) {
            onFocus();
          }
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    );
  }, [editor, onBlur, onFocus]);

  return null;
};

export default OnBlurBlock;
