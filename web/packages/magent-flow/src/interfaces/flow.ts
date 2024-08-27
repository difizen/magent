import { ReactFlowJsonObject, XYPosition } from '@xyflow/react';

export enum NodeTypeEnum {
  'Start' = 'start',
  'End' = 'end',
  'LLM' = 'llm',
  'Knowledge' = 'knowledge',
  'Agent' = 'agent',

  // 'Plugin' = 'plugin',
  'Tool' = 'tool',
  'IfElse' = 'ifelse',
}

export enum IfElseNodeCompareType {
  Equal = 'equal',
  NotEqual = 'notequal',
  Blank = 'blank',
}

export interface LiteralValueType {
  type: 'value';
  content?: string | number | boolean | string[] | number[] | boolean[];
}

export interface RefValueType {
  type: 'reference';
  content?: {
    source: string;
    blockID: string;
    name: string;
  };
}

export interface BasicSchema {
  type: string;
  name?: string;
  value?: LiteralValueType | RefValueType;
  required?: boolean;
  // BasicSchema 对应 type = list，BasicSchema[] 对应 type = object
  schema?: BasicSchema | BasicSchema[];
  description?: string;
}

export interface NodeDataConfigType {
  inputs?: {
    input_param: BasicSchema[];
    [key: string]: BasicSchema[];
  };
  outputs?: BasicSchema[];
}

// export interface NodeDataMetaType {
//   name: string;
//   icon?: string;
//   description?: string;
// }

export interface NodeDataType {
  id: string | number;
  type: NodeTypeEnum;
  runResult?: {
    status: string;
    result?: any;
  };
  name: string;
  icon?: string;
  description?: string;
  config?: NodeDataConfigType;
}

export interface NodeType {
  id: string;
  position: XYPosition;
  type: string;
  data: NodeDataType;
  selected?: boolean;
}

export type FlowType = {
  id: string;
  name: string;
  icon?: string;
  description: string;
  data: ReactFlowJsonObject | null;
  //
  updated_at?: string;
  date_created?: string;
  user_id?: string;
};

// right side
export type sourceHandleType = {
  dataType: string;
  id: string;
  output_types: string[];
  conditionalPath?: string | null;
  name: string;
};

//left side
export type targetHandleType = {
  inputTypes?: string[];
  type: string;
  fieldName: string;
  id: string;
  proxy?: { field: string; id: string };
};
