import type {
  NodeDataConfigType,
  NodeDataMetaType,
  NodeDataType,
} from '@flow/interfaces/flow.js';
import { NodeTypeEnum } from '@flow/interfaces/flow.js';

import { FormSchema } from './FormSchema/index.js';
import { UUID } from './uuid.js';

// 不同类型的节点的基础类
//

/**
 * 开始节点
 * 只设置输入
 * 输出和输入一致
 */
export class StartNode implements NodeDataType {
  id: string = UUID.getInstance().uniqueID();

  type: NodeTypeEnum = NodeTypeEnum.Start;

  config: NodeDataConfigType | undefined = {
    params: undefined,
    inputs: new FormSchema(),
    outputs: new FormSchema(),
  };

  nodeMeta: NodeDataMetaType = {
    title: '开始节点',
    description: '开始节点',
  };

  toJson() {
    const node: NodeDataType = {
      id: this.id,
      nodeType: this.nodeType,
      nodeMeta: this.nodeMeta,
      config: this.config,
    };
    return JSON.stringify(node);
  }

  fromJson(json: string) {
    try {
      const node: NodeDataType = JSON.parse(json);

      this.id = node.id;
      this.nodeType = node.nodeType;
      this.nodeMeta = node.nodeMeta;
      this.config = node.config;
    } catch (error) {}
  }

  toXYFlowJson() {}
}

// /**
//  * 插件节点
//  */
// export class PluginNode implements FlowNode {
//   extend(e) {}
// }
// class BingPluginNode extends PluginNode {}

// new BingPluginNode().extend({
//   inpot: (JSONSchema = {
//     type: 'object',
//     properties: {
//       count: {
//         type: 'integer',
//       },
//       offset: {
//         type: 'integer',
//       },
//       query: {
//         type: 'string',
//       },
//     },
//     required: ['a'],
//   }),
// });
