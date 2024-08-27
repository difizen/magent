---
title: SchemaConfigForm
group: { title: 'Schema', order: 1 }
toc: menu
order: 1
demo: { cols: 2 }
---

## 基础用法

用于渲染jsonschema config的表单，传入一个FormSchema

```jsx
import React from 'react';
import { SchemaConfigForm, FormSchema } from '@alipay/ai-workflow';

const mockSchema = new FormSchema();
mockSchema.updateSchema({
  $schema: 'http://json-schema.org/draft-04/schema#',
  type: 'object',
  properties: {},
});

export default () => (
  <SchemaConfigForm formSchema={mockSchema}>Hi, bigfish</SchemaConfigForm>
);
```

<API id="SchemaConfigForm"></API>
