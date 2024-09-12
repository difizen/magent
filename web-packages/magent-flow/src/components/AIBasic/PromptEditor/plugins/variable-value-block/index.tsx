import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import type { TextNode } from 'lexical';
import { useCallback, useEffect } from 'react';

import { useLexicalTextEntity } from '../../hooks.js';

import { $createVariableValueBlockNode, VariableValueBlockNode } from './node.js';
import { getHashtagRegexString } from './utils.js';

const REGEX = new RegExp(getHashtagRegexString(), 'i');

const VariableValueBlock = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([VariableValueBlockNode])) {
      throw new Error(
        'VariableValueBlockPlugin: VariableValueNode not registered on editor',
      );
    }
  }, [editor]);

  const createVariableValueBlockNode = useCallback(
    (textNode: TextNode): VariableValueBlockNode => {
      return $createVariableValueBlockNode(textNode.getTextContent());
    },
    [],
  );

  const getVariableValueMatch = useCallback((text: string) => {
    const matchArr = REGEX.exec(text);

    if (matchArr === null) {
      return null;
    }

    const hashtagLength = matchArr[0].length;
    const startOffset = matchArr.index;
    const endOffset = startOffset + hashtagLength;
    return {
      end: endOffset,
      start: startOffset,
    };
  }, []);

  useLexicalTextEntity<VariableValueBlockNode>(
    getVariableValueMatch,
    VariableValueBlockNode,
    createVariableValueBlockNode,
  );

  return null;
};

export default VariableValueBlock;
