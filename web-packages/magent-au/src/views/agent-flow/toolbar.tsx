import { MessageOutlined, SaveOutlined } from '@ant-design/icons';
import type { Edge, NodeType } from '@difizen/magent-flow';
import { useFlowStore } from '@difizen/magent-flow';
import type { CommandRegistry, ToolbarRegistry } from '@difizen/mana-app';
import {
  singleton,
  ToolbarContribution,
  useInject,
  CommandContribution,
} from '@difizen/mana-app';
import { Button, message } from 'antd';
import classNames from 'classnames';
import yaml from 'js-yaml';

import type { MainView } from '../common/main-view.js';

import { AgentFlowDevView } from './flow-dev-view.js';
import { OutputEdgeParser, OutputNodeParser } from './flow-utils.js';

export const RunButton = () => {
  const flowDevView = useInject(AgentFlowDevView);
  return (
    <Button
      type="text"
      className={classNames({ 'magent-agent-chat-btn-actived': !flowDevView.hideChat })}
      onClick={() => (flowDevView.hideChat = !flowDevView.hideChat)}
      icon={<MessageOutlined />}
    >
      运行
    </Button>
  );
};
export const SaveButton = () => {
  const flowDevView = useInject(AgentFlowDevView);
  const { getFlow } = useFlowStore();
  return (
    <Button
      type="primary"
      icon={<SaveOutlined />}
      onClick={async () => {
        const flow = JSON.parse(JSON.stringify(getFlow()));
        const nodes = flow.nodes.map((node: NodeType) => {
          return OutputNodeParser(node);
        });
        const edges = flow.edges.map((edge: Edge) => {
          return OutputEdgeParser(edge);
        });
        const graph = {
          nodes,
          edges,
        };

        const saved = await flowDevView.save(graph);
        if (saved) {
          message.success('保存成功');
          flowDevView.agent?.fetchInfo(undefined, true);
        }
        const graph_yaml = yaml.dump(graph);
        localStorage.setItem('magent_flow_testdata', graph_yaml);
      }}
    >
      保存
    </Button>
  );
};

export const AgentFlowCommnds = {
  chat: {
    id: 'agent-flow-chat',
  },
  save: {
    id: 'agent-flow-save',
  },
};
@singleton({ contrib: [CommandContribution, ToolbarContribution] })
export class AgentFlowMainToolbarContribution
  implements ToolbarContribution, CommandContribution
{
  protected isAgentFlowDev = (mainView: MainView) => {
    return !!(
      mainView &&
      mainView.active &&
      mainView.active instanceof AgentFlowDevView
    );
  };
  registerCommands(commands: CommandRegistry) {
    commands.registerCommand(AgentFlowCommnds['chat'], {
      execute: () => {
        //
      },
      isVisible: this.isAgentFlowDev,
    });
    commands.registerCommand(AgentFlowCommnds['save'], {
      execute: () => {
        //
      },
      isVisible: this.isAgentFlowDev,
      isEnabled: () => true,
    });
  }
  registerToolbarItems(registry: ToolbarRegistry): void {
    registry.registerItem({
      id: `${AgentFlowCommnds['chat'].id}-toolbar-item`,
      icon: RunButton,
      command: AgentFlowCommnds['chat'].id,
    });
    registry.registerItem({
      id: `${AgentFlowCommnds['save'].id}-toolbar-item`,
      icon: SaveButton,
      command: AgentFlowCommnds['save'].id,
    });
  }
}
