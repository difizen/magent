import { message } from 'antd';
import type {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7TypeName,
} from 'json-schema';

import { UUID } from '@/spec/uuid.js';

export type OrderJSONSchema7 = JSONSchema7 & {
  order: number;
};

export interface CascaderOptions {
  value: string;
  label: string;
  children?: CascaderOptions[];
}

/**
 * 声明输入的表单数据格式
 * 表单内容
 */
export class FormSchema {
  uuid = UUID.getInstance().uniqueID();

  jsonschema: JSONSchema7 = {
    $id: this.uuid,
    type: 'object',
    properties: {},
    required: [],
  };

  constructor(schema: JSONSchema7) {
    Object.assign(this.jsonschema, schema);
  }
  /**
   * 获取指定路径的属性
   * 方便添加属性
   * /a/b/c/
   * @param pointer
   * @returns
   */
  getSchemaByPoint(pointer: string) {
    if (pointer === '/' || pointer === '') {
      return this.jsonschema;
    }

    let pointers = pointer.split('/');
    if (pointers[0] !== '') {
      throw new Error('invalid pointer');
    }
    pointers = pointers.slice(1);

    // base是一个object模式
    let schema = this.jsonschema;
    while (pointers.length > 0) {
      const pointer = pointers.shift();
      if (pointer === undefined) {
        throw new Error('invalid pointer');
      }
      if (schema) {
        if (schema.type === 'object') {
          if (schema?.properties?.[pointer]) {
            // 有就递归下沉
            schema = schema.properties[pointer] as JSONSchema7;
          } else {
            // 没有属性就添加
            schema!.properties![pointer] = {};
            return schema!.properties![pointer];
          }
        } else if (schema?.type === 'array') {
          if (schema?.items) {
            const index = parseInt(pointer);
            if (Array.isArray(schema.items)) {
              schema = schema.items[index] as JSONSchema7;
            } else {
              schema = schema.items as JSONSchema7;
            }
          }
        }
      }
    }
    return schema;
  }

  private randommName = () => {
    return (
      'RandaomName__-' +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  isRandomName = (name: string) => {
    return name.startsWith('RandaomName__-');
  };

  /**
   * 动态表单添加属性
   * @param property
   * @returns
   */
  addField = (options: {
    pointer: string; // 指定属性路径，如 /a/b
    name?: string;
    type: JSONSchema7TypeName;
    description: string;
    required: boolean;
  }) => {
    const { pointer, name = this.randommName(), type, description, required } = options;
    if (typeof this.jsonschema !== 'boolean') {
      const schema = this.getSchemaByPoint(pointer);
      if (schema.type === 'array') {
        // 如果存在属性
        if (!schema?.items) {
          schema.items = {
            type: type,
            description,
          };
        } else if (!Array.isArray(schema?.items)) {
          const items = schema.items as JSONSchema7Definition;
          schema.items = [
            items,
            {
              type: type,
              description,
            },
          ];
        } else if (Array.isArray(schema?.items)) {
          schema.items.push({
            type: type,
            description,
          });
        }
      } else if (schema?.type === 'object') {
        // 使用order 记录顺序
        let order = 0;
        Object.entries(schema.properties || {}).forEach(([, val]) => {
          const v = val as OrderJSONSchema7;
          if (v?.order) {
            order = v?.order > order ? v?.order : order;
          }
        });

        (schema.properties![name] as OrderJSONSchema7) = {
          type: type,
          description,
          order: order + 1,
        };
        if (type === 'object') {
          schema.properties![name].properties = {};
        }
      } else {
        schema.type = type;
        schema.description = description;
      }
      if (required) {
        // 如果是object的话，require在当前位置添加
        if (schema.type === 'object') {
          if (!schema.required) {
            schema.required = [];
          }
          schema.required = [...schema.required, name];
        } else {
          // 在父级添加
          const parentPointer = pointer.split('/').slice(0, -1).join('/');
          const parentSchema = this.getSchemaByPoint(parentPointer);

          if (!parentSchema.required) {
            parentSchema.required = [];
          }
          parentSchema.required = [...parentSchema.required, name];
        }
      }
    }
    return false;
  };

  /**
   * 动态表单更新属性
   * @param property
   * @returns
   */
  updateField = (options: {
    pointer: string; // 指定属性路径，如 /a/b
    key: 'variableName' | 'variableType' | 'description' | 'required';
    value: any;
    currentVariableName: string;
  }) => {
    const { pointer, key, value, currentVariableName } = options;
    if (typeof this.jsonschema !== 'boolean') {
      const schema = this.getSchemaByPoint(pointer);
      if (schema.type === 'object') {
        if (schema.properties) {
          if (key === 'variableName') {
            const old = schema.properties?.[currentVariableName];
            if (value !== currentVariableName) {
              schema.properties[value] = old;
              delete schema.properties[currentVariableName];
            } else {
              message.info('变量名不能和已有变量名相同');
              return false;
            }
            return true;
          }
          if (key === 'variableType') {
            if ((schema.properties[currentVariableName] as JSONSchema7).type) {
              // 处理数组类型
              if (value.startsWith('Array<')) {
                const t = (
                  value.replace('Array<', '').replace('>', '') as string
                ).toLocaleLowerCase();
                schema.properties[currentVariableName].type = 'array';
                schema.properties[currentVariableName].items = {
                  type: t,
                };
                if (t === 'object') {
                  schema.properties[currentVariableName].items.properties = {};
                }
                return true;
              }
              if (value === 'object') {
                schema.properties[currentVariableName].type = value;
                schema.properties[currentVariableName].properties = {};
                return true;
              }

              // 基础类型
              schema.properties[currentVariableName].type = value;
              delete schema.properties[currentVariableName].items;
              delete schema.properties[currentVariableName].properties;

              return true;
            }
          }
          if (key === 'description') {
            if (schema.properties[currentVariableName] as JSONSchema7) {
              schema.properties[currentVariableName].description = value;
              return true;
            }
          }
          if (key === 'required') {
            if (!this.isRandomName(currentVariableName)) {
              if (schema.properties[currentVariableName]) {
                if (!schema.required) {
                  schema.required = [];
                }
                if (value) {
                  if (!schema.required?.includes(value)) {
                    schema.required?.push(currentVariableName);
                  }
                } else {
                  if (schema.required?.includes(currentVariableName)) {
                    schema.required = schema.required.filter(
                      (item) => item !== currentVariableName,
                    );
                  }
                }

                return true;
              }
            }
          }
        }
      }
    }
    return false;
  };

  updateSchema(schema: JSONSchema7) {
    Object.assign(this.jsonschema, schema);
  }

  log() {
    return JSON.stringify(this.jsonschema, null, 4);
  }
}

export const variableTypeOptions: {
  label: string;
  value:
    | JSONSchema7TypeName
    | 'Array<String>'
    | 'Array<Integer>'
    | 'Array<Boolean>'
    | 'Array<Number>'
    | 'Array<Object>';
}[] = [
  {
    label: 'String',
    value: 'string',
  },
  {
    label: 'Integer',
    value: 'integer',
  },
  {
    label: 'Boolean',
    value: 'boolean',
  },
  {
    label: 'Number',
    value: 'number',
  },
  {
    label: 'Object',
    value: 'object',
  },

  {
    label: 'Array<String>',
    value: 'Array<String>',
  },
  {
    label: 'Array<Integer>',
    value: 'Array<Integer>',
  },
  {
    label: 'Array<Boolean>',
    value: 'Array<Boolean>',
  },
  {
    label: 'Array<Number>',
    value: 'Array<Number>',
  },
  {
    label: 'Array<Object>',
    value: 'Array<Object>',
  },
];
