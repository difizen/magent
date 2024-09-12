import { AndroidFilled } from '@ant-design/icons';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodes } from 'lexical';
import { useMemo } from 'react';

import type { ExternalToolBlockType, VariableBlockType } from '../../types.js';
import { $createCustomTextNode } from '../custom-text/node.js';
import { INSERT_VARIABLE_VALUE_BLOCK_COMMAND } from '../variable-block/index.js';

import { PickerBlockMenuOption } from './menu.js';
import { VariableMenuItem } from './variable-option.js';

export const useVariableOptions = (
  variableBlock?: VariableBlockType,
  queryString?: string,
): PickerBlockMenuOption[] => {
  const [editor] = useLexicalComposerContext();

  const options = useMemo(() => {
    if (!variableBlock?.variables) {
      return [];
    }

    const baseOptions = variableBlock.variables.map((item) => {
      return new PickerBlockMenuOption({
        key: item.value,
        group: 'prompt variable',
        render: ({ queryString, isSelected, onSelect, onSetHighlight }) => {
          return (
            <VariableMenuItem
              title={item.value}
              icon={<AndroidFilled className="w-[14px] h-[14px] text-[#2970FF]" />}
              queryString={queryString}
              isSelected={isSelected}
              onClick={onSelect}
              onMouseEnter={onSetHighlight}
            />
          );
        },
        onSelect: () => {
          editor.dispatchCommand(
            INSERT_VARIABLE_VALUE_BLOCK_COMMAND,
            `{{${item.value}}}`,
          );
        },
      });
    });
    if (!queryString) {
      return baseOptions;
    }

    const regex = new RegExp(queryString, 'i');

    return baseOptions.filter((option) => regex.test(option.key));
  }, [editor, queryString, variableBlock]);

  const addOption = useMemo(() => {
    return new PickerBlockMenuOption({
      key: '添加新变量',
      group: 'prompt variable',
      render: ({ queryString, isSelected, onSelect, onSetHighlight }) => {
        return (
          <VariableMenuItem
            title={'添加新变量'}
            icon={<AndroidFilled className="mr-2 w-[14px] h-[14px] text-[#2970FF]" />}
            queryString={queryString}
            isSelected={isSelected}
            onClick={onSelect}
            onMouseEnter={onSetHighlight}
          />
        );
      },
      onSelect: () => {
        editor.update(() => {
          const prefixNode = $createCustomTextNode('{{');
          const suffixNode = $createCustomTextNode('}}');
          $insertNodes([prefixNode, suffixNode]);
          prefixNode.select();
        });
      },
    });
  }, [editor]);

  return useMemo(() => {
    return variableBlock?.show ? [...options, addOption] : [];
  }, [options, addOption, variableBlock?.show]);
};

export const useExternalToolOptions = (
  externalToolBlockType?: ExternalToolBlockType,
  queryString?: string,
) => {
  const [editor] = useLexicalComposerContext();

  const options = useMemo(() => {
    if (!externalToolBlockType?.externalTools) {
      return [];
    }
    const baseToolOptions = externalToolBlockType.externalTools.map((item) => {
      return new PickerBlockMenuOption({
        key: item.name,
        group: 'external tool',
        render: ({ queryString, isSelected, onSelect, onSetHighlight }) => {
          return (
            <VariableMenuItem
              title={item.name}
              icon={
                <AndroidFilled
                  className="!w-[14px] !h-[14px]"
                  // icon={item.icon}
                  // background={item.icon_background}
                />
              }
              extraElement={
                <div className="text-xs text-gray-400">{item.variableName}</div>
              }
              queryString={queryString}
              isSelected={isSelected}
              onClick={onSelect}
              onMouseEnter={onSetHighlight}
            />
          );
        },
        onSelect: () => {
          editor.dispatchCommand(
            INSERT_VARIABLE_VALUE_BLOCK_COMMAND,
            `{{${item.variableName}}}`,
          );
        },
      });
    });
    if (!queryString) {
      return baseToolOptions;
    }

    const regex = new RegExp(queryString, 'i');

    return baseToolOptions.filter((option) => regex.test(option.key));
  }, [editor, queryString, externalToolBlockType]);

  const addOption = useMemo(() => {
    return new PickerBlockMenuOption({
      key: '添加工具',
      group: 'external tool',
      render: ({ queryString, isSelected, onSelect, onSetHighlight }) => {
        return (
          <VariableMenuItem
            title={'添加工具'}
            icon={<AndroidFilled className="mr-2 w-[14px] h-[14px] text-[#444CE7]" />}
            extraElement={<AndroidFilled className="w-3 h-3 text-gray-400" />}
            queryString={queryString}
            isSelected={isSelected}
            onClick={onSelect}
            onMouseEnter={onSetHighlight}
          />
        );
      },
      onSelect: () => {
        externalToolBlockType?.onAddExternalTool?.();
      },
    });
  }, [externalToolBlockType]);

  return useMemo(() => {
    return externalToolBlockType?.show ? [...options, addOption] : [];
  }, [options, addOption, externalToolBlockType?.show]);
};

export const useOptions = (
  variableBlock?: VariableBlockType,
  externalToolBlockType?: ExternalToolBlockType,
  queryString?: string,
) => {
  const variableOptions = useVariableOptions(variableBlock, queryString);
  const externalToolOptions = useExternalToolOptions(
    externalToolBlockType,
    queryString,
  );

  return useMemo(() => {
    return {
      allFlattenOptions: [...variableOptions, ...externalToolOptions],
    };
  }, [variableOptions, externalToolOptions]);
};
