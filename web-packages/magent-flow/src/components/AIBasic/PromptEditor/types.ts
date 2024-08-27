export type Option = {
  value: string;
  name: string;
};

export type ExternalToolOption = {
  name: string;
  variableName: string;
  icon?: string;
  icon_background?: string;
};

export type VariableBlockType = {
  show?: boolean;
  variables?: Option[];
};

export type ExternalToolBlockType = {
  show?: boolean;
  externalTools?: ExternalToolOption[];
  onAddExternalTool?: () => void;
};

export type MenuTextMatch = {
  leadOffset: number;
  matchingString: string;
  replaceableString: string;
};
