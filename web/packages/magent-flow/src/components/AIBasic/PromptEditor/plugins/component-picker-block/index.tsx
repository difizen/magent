import { flip, offset, shift, useFloating } from '@floating-ui/react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import type { MenuRenderFn } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { LexicalTypeaheadMenuPlugin } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import type { TextNode } from 'lexical';
import React, { Fragment, memo, useCallback, useState } from 'react';
import ReactDOM from 'react-dom';

import { useEventEmitterContextContext } from '@/context/event-emitter';

import { useBasicTypeaheadTriggerMatch } from '../../hooks';
import type { ExternalToolBlockType, VariableBlockType } from '../../types';
import { $splitNodeContainingQuery } from '../../utils';
import { INSERT_VARIABLE_VALUE_BLOCK_COMMAND } from '../variable-block';

import { useOptions } from './hooks';
import type { PickerBlockMenuOption } from './menu';

type ComponentPickerProps = {
  triggerString: string;
  variableBlock?: VariableBlockType;
  externalToolBlock?: ExternalToolBlockType;
};
const ComponentPicker = ({
  triggerString,
  variableBlock,
  externalToolBlock,
}: ComponentPickerProps) => {
  const { eventEmitter } = useEventEmitterContextContext();
  const { refs, floatingStyles, isPositioned } = useFloating({
    placement: 'bottom-start',
    middleware: [
      offset(0), // fix hide cursor
      shift({
        padding: 8,
      }),
      flip(),
    ],
  });
  const [editor] = useLexicalComposerContext();
  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch(triggerString, {
    minLength: 0,
    maxLength: 0,
  });

  const [queryString, setQueryString] = useState<string | null>(null);

  eventEmitter?.useSubscription((v: any) => {
    if (v.type === INSERT_VARIABLE_VALUE_BLOCK_COMMAND) {
      editor.dispatchCommand(INSERT_VARIABLE_VALUE_BLOCK_COMMAND, `{{${v.payload}}}`);
    }
  });

  const { allFlattenOptions } = useOptions(variableBlock, externalToolBlock);

  const onSelectOption = useCallback(
    (
      selectedOption: PickerBlockMenuOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        if (nodeToRemove && selectedOption?.key) {
          nodeToRemove.remove();
        }

        selectedOption.onSelectMenuOption();
        closeMenu();
      });
    },
    [editor],
  );

  const handleSelectWorkflowVariable = useCallback(
    (variables: string[]) => {
      editor.update(() => {
        const needRemove = $splitNodeContainingQuery(
          checkForTriggerMatch(triggerString, editor)!,
        );
        if (needRemove) {
          needRemove.remove();
        }
      });
    },
    [editor, checkForTriggerMatch, triggerString],
  );

  const renderMenu = useCallback<MenuRenderFn<PickerBlockMenuOption>>(
    (
      anchorElementRef,
      { options, selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
    ) => {
      if (!(anchorElementRef.current && allFlattenOptions.length)) {
        return null;
      }
      refs.setReference(anchorElementRef.current);

      return (
        <>
          {ReactDOM.createPortal(
            // The `LexicalMenu` will try to calculate the position of the floating menu based on the first child.
            // Since we use floating ui, we need to wrap it with a div to prevent the position calculation being affected.
            // See https://github.com/facebook/lexical/blob/ac97dfa9e14a73ea2d6934ff566282d7f758e8bb/packages/lexical-react/src/shared/LexicalMenu.ts#L493
            <div className="w-0 h-0">
              <div
                className="p-1 w-[260px] bg-white rounded-lg border-[0.5px] border-gray-200 shadow-lg overflow-y-auto overflow-x-hidden"
                style={{
                  ...floatingStyles,
                  visibility: isPositioned ? 'visible' : 'hidden',
                  maxHeight: 'calc(1 / 3 * 100vh)',
                }}
                ref={refs.setFloating}
              >
                {options.map((option, index) => (
                  <Fragment key={option.key}>
                    {
                      // Divider
                      index !== 0 && options.at(index - 1)?.group !== option.group && (
                        <div className="h-px bg-gray-100 my-1 w-screen -translate-x-1"></div>
                      )
                    }
                    {option.renderMenuOption({
                      queryString,
                      isSelected: selectedIndex === index,
                      onSelect: () => {
                        selectOptionAndCleanUp(option);
                      },
                      onSetHighlight: () => {
                        setHighlightedIndex(index);
                      },
                    })}
                  </Fragment>
                ))}
              </div>
            </div>,
            anchorElementRef.current,
          )}
        </>
      );
    },
    [
      allFlattenOptions.length,
      refs,
      isPositioned,
      floatingStyles,
      queryString,
      handleSelectWorkflowVariable,
    ],
  );

  return (
    <LexicalTypeaheadMenuPlugin
      options={allFlattenOptions}
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      // The `translate` class is used to workaround the issue that the `typeahead-menu` menu is not positioned as expected.
      // See also https://github.com/facebook/lexical/blob/772520509308e8ba7e4a82b6cd1996a78b3298d0/packages/lexical-react/src/shared/LexicalMenu.ts#L498
      //
      // We no need the position function of the `LexicalTypeaheadMenuPlugin`,
      // so the reference anchor should be positioned based on the range of the trigger string, and the menu will be positioned by the floating ui.
      anchorClassName="z-[999999] translate-y-[calc(-100%-3px)]"
      menuRenderFn={renderMenu}
      triggerFn={checkForTriggerMatch}
    />
  );
};

export default memo(ComponentPicker);
