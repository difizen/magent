import { CodeNode } from '@lexical/code';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import type { EditorState } from 'lexical';
import { $getRoot, TextNode } from 'lexical';
import React, { type FC } from 'react';

import ComponentPickerBlock from './plugins/component-picker-block/index.js';
import { CustomTextNode } from './plugins/custom-text/node.js';
import OnBlurBlock from './plugins/on-blur-or-focus-block.js';
import Placeholder from './plugins/placeholder.js';
import UpdateBlock from './plugins/update-block.js';
import VariableBlock from './plugins/variable-block/index.js';
import VariableValueBlock from './plugins/variable-value-block/index.js';
import { VariableValueBlockNode } from './plugins/variable-value-block/node.js';
import type { ExternalToolBlockType, VariableBlockType } from './types.js';
import { textToEditorState } from './utils.js';

export type PromptEditorProps = {
  instanceId?: string;
  compact?: boolean;
  className?: string;
  placeholder?: string;
  placeholderClassName?: string;
  style?: React.CSSProperties;
  value?: string;
  editable?: boolean;
  onChange?: (text: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  variableBlock?: VariableBlockType;
  externalToolBlock?: ExternalToolBlockType;
};

const PromptEditor: FC<PromptEditorProps> = ({
  instanceId,
  compact,
  className,
  placeholder,
  placeholderClassName,
  style,
  value,
  editable = true,
  onChange,
  onBlur,
  onFocus,
  variableBlock,
  externalToolBlock,
}) => {
  const initialConfig = {
    namespace: 'prompt-editor',
    nodes: [
      CodeNode,
      CustomTextNode,
      {
        replace: TextNode,
        with: (node: TextNode) => new CustomTextNode(node.__text),
      },
      VariableValueBlockNode,
    ],
    editorState: textToEditorState(value || ''),
    onError: (error: Error) => {
      throw error;
    },
  };

  const handleEditorChange = (editorState: EditorState) => {
    const text = editorState.read(() => {
      return $getRoot()
        .getChildren()
        .map((p) => p.getTextContent())
        .join('\n');
    });

    if (onChange) {
      onChange(text);
    }
  };

  return (
    <LexicalComposer initialConfig={{ ...initialConfig, editable }}>
      <div className="relative h-full nodrag nowheel">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className={`${className || ''} outline-none ${
                compact ? 'leading-5 text-[13px]' : 'leading-6 text-sm'
              } text-gray-700 p-3`}
              style={style || {}}
            />
          }
          placeholder={
            <Placeholder
              value={placeholder}
              className={placeholderClassName}
              compact={compact}
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ComponentPickerBlock
          triggerString="/"
          variableBlock={variableBlock}
          externalToolBlock={externalToolBlock}
        />
        <ComponentPickerBlock
          triggerString="{"
          variableBlock={variableBlock}
          externalToolBlock={externalToolBlock}
        />

        {(variableBlock?.show || externalToolBlock?.show) && (
          <>
            <VariableBlock />
            <VariableValueBlock />
          </>
        )}
        <OnChangePlugin onChange={handleEditorChange} />
        <OnBlurBlock onBlur={onBlur} onFocus={onFocus} />
        <UpdateBlock instanceId={instanceId} />
        {/* <SetEditorValuePlugin /> */}
      </div>
    </LexicalComposer>
  );
};

export default PromptEditor;
