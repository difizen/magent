import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import type { EntityMatch } from '@lexical/text';
import { mergeRegister } from '@lexical/utils';
import type { Klass, LexicalEditor, TextNode } from 'lexical';
import { useCallback, useEffect } from 'react';

import type { CustomTextNode } from './plugins/custom-text/node.js';
import { registerLexicalTextEntity } from './utils.js';

export function useLexicalTextEntity<T extends TextNode>(
  getMatch: (text: string) => null | EntityMatch,
  targetNode: Klass<T>,
  createNode: (textNode: CustomTextNode) => T,
) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      ...registerLexicalTextEntity(editor, getMatch, targetNode, createNode),
    );
  }, [createNode, editor, getMatch, targetNode]);
}

export type MenuTextMatch = {
  leadOffset: number;
  matchingString: string;
  replaceableString: string;
};
export type TriggerFn = (text: string, editor: LexicalEditor) => MenuTextMatch | null;
export const PUNCTUATION =
  '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
export function useBasicTypeaheadTriggerMatch(
  trigger: string,
  { minLength = 1, maxLength = 75 }: { minLength?: number; maxLength?: number },
): TriggerFn {
  return useCallback(
    (text: string) => {
      const validChars = `[${PUNCTUATION}\\s]`;
      const TypeaheadTriggerRegex = new RegExp(
        '(.*)(' + `[${trigger}]` + `((?:${validChars}){0,${maxLength}})` + ')$',
      );
      const match = TypeaheadTriggerRegex.exec(text);
      if (match !== null) {
        const maybeLeadingWhitespace = match[1];
        const matchingString = match[3];
        if (matchingString.length >= minLength) {
          return {
            leadOffset: match.index + maybeLeadingWhitespace.length,
            matchingString,
            replaceableString: match[2],
          };
        }
      }
      return null;
    },
    [maxLength, minLength, trigger],
  );
}
