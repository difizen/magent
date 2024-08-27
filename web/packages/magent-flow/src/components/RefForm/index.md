---
title: RefForm
group: { title: 'Schema', order: 2 }
toc: menu
order: 1
demo: { cols: 2 }
---

## 基本用法

> 渲染输入参数表单，支持传入节点引用数据

```jsx
import React from 'react';
import { RefForm, FormSchema, StartNode } from '@alipay/ai-workflow';

const startNode = new StartNode();
startNode.input.updateSchema({
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '姓名',
    },
  },
});

export default () => <RefForm flowNodes={[startNode]}>Hi, bigfish</RefForm>;
```

<API id="RefForm"></API>
