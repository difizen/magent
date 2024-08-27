import { FormSchema } from './FormSchema';

describe('getSchemaByPoint', () => {
  it('基础路径 /', () => {
    const input = new FormSchema();
    input.jsonschema = {
      type: 'object',
      properties: {
        a: {
          type: 'string',
          description: 'this is a',
        },
        b: {
          type: 'object',
          properties: {
            c: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
    };

    expect(input.getSchemaByPoint('/')).toEqual({
      type: 'object',
      properties: {
        a: {
          type: 'string',
          description: 'this is a',
        },
        b: {
          type: 'object',
          properties: {
            c: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
    });
  });

  it('如果对应路径没有参数，应该创建一个properties对象，并且返回该对象', () => {
    const input = new FormSchema();
    input.jsonschema = {
      type: 'object',
      properties: {},
    };

    const got = input.getSchemaByPoint('/a');
    // 没有对应的属性
    expect(got).toEqual({});

    expect(input.jsonschema).toEqual({
      type: 'object',
      properties: {
        a: {},
      },
    });
  });

  it('获取对应的schema', () => {
    const input = new FormSchema();
    input.jsonschema = {
      type: 'object',
      properties: {
        a: {
          type: 'string',
          description: 'this is a',
        },
        b: {
          type: 'object',
          properties: {
            c: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
    };
    expect(input.getSchemaByPoint('/a')).toEqual({
      type: 'string',
      description: 'this is a',
    });

    expect(input.getSchemaByPoint('/b')).toEqual({
      type: 'object',
      properties: {
        c: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    });
  });

  it('数组则返回对应的数组对象', () => {
    const input = new FormSchema();
    input.jsonschema = {
      type: 'object',
      properties: {
        a: {
          type: 'string',
          description: 'this is a',
        },
        b: {
          type: 'object',
          properties: {
            c: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
    };

    // 数组则返回对应的对象
    expect(input.getSchemaByPoint('/b/c')).toEqual({
      type: 'array',
      items: {
        type: 'string',
      },
    });
  });
});

describe('addField', () => {
  it('添加表单field', () => {
    const input = new FormSchema();
    input.addField({
      pointer: '/', // 指定属性路径，如 /a/b
      name: 'a',
      type: 'object',
      description: 'this is a',
      required: false,
    });
    const got = input.log();
    console.log(got, '==got');
    expect(got).toMatchSnapshot();
    // expect(1).toBe(0);
  });

  it('添加表单field1', () => {
    const input = new FormSchema();
    input.addField({
      pointer: '/', // 指定属性路径，如 /a/b
      name: 'a',
      type: 'object',
      description: 'this is a',
      required: false,
    });
    console.log(input.log(), 'log1');
    input.addField({
      pointer: '/a/b', // 指定属性路径，如 /a/b
      name: 'b',
      type: 'string',
      description: 'this is desc',
      required: true,
    });
    input.addField({
      pointer: '/a', // 指定属性路径，如 /a/b
      name: 'subA',
      type: 'object',
      description: 'this is desc',
      required: true,
    });
    input.addField({
      pointer: '/a/subA', // 指定属性路径，如 /a/b
      name: 'aryC',
      type: 'array',
      description: 'this is desc',
      required: true,
    });
    input.addField({
      pointer: '/', // 指定属性路径，如 /a/b
      name: 'first',
      type: 'object',
      description: 'this is a',
      required: true,
    });
    const got = input.log();
    console.log(got);
    expect(got).toMatchSnapshot();
  });
});
