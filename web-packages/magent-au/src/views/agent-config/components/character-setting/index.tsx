import {
  ContactsTwoTone,
  HighlightTwoTone,
  ScheduleTwoTone,
  SoundTwoTone,
} from '@ant-design/icons';
import { PromptEditor } from '@difizen/ai-flow';
import { useInject, ViewInstance } from '@difizen/mana-app';
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';
import { memo, useEffect, useState } from 'react';

import type { AgentConfigView } from '../../view.js';
import './index.less';

const clsPrefix = 'character-settings';

export const CharacterSetting = memo(function CharacterSetting() {
  const instance = useInject<AgentConfigView>(ViewInstance);
  const agent = instance.agent;
  const prompt = agent.prompt;

  const items: CollapseProps['items'] = prompt
    ? [
        {
          key: 'introduction',
          label: (
            <div className={`${clsPrefix}-label`}>
              <ContactsTwoTone style={{ marginRight: 8 }} />
              人设
            </div>
          ),
          children: (
            <div className={`${clsPrefix}-body`}>
              <PromptEditor
                placeholder="请输入人设"
                className={`${clsPrefix}-textarea`}
                value={prompt?.introduction}
                onChange={(value) => {
                  if (prompt) {
                    prompt.introduction = value;
                  }
                }}
                variableBlock={{
                  show: true,
                  variables: [],
                }}
              />
            </div>
          ),
        },
        {
          key: 'target',
          label: (
            <div className={`${clsPrefix}-label`}>
              <ScheduleTwoTone style={{ marginRight: 8 }} />
              目标
            </div>
          ),
          children: (
            <div className={`${clsPrefix}-body`}>
              <PromptEditor
                placeholder="请输入目标"
                className={`${clsPrefix}-textarea`}
                value={prompt?.target}
                onChange={(value) => {
                  if (prompt) {
                    prompt.target = value;
                  }
                }}
                variableBlock={{
                  show: true,
                  variables: [],
                }}
              />
            </div>
          ),
        },
        {
          key: 'instruction',
          label: (
            <div className={`${clsPrefix}-label`}>
              <HighlightTwoTone style={{ marginRight: 8 }} />
              要求
            </div>
          ),
          children: (
            <div className={`${clsPrefix}-body`}>
              <PromptEditor
                placeholder="请输入要求"
                className={`${clsPrefix}-textarea`}
                value={prompt?.instruction}
                onChange={(value) => {
                  if (prompt) {
                    prompt.instruction = value;
                  }
                }}
                variableBlock={{
                  show: true,
                  variables: [],
                }}
              />
            </div>
          ),
        },
      ]
    : [];

  items.push({
    key: 'openingSpeech',
    label: (
      <div className={`${clsPrefix}-label`}>
        <SoundTwoTone style={{ marginRight: 8 }} />
        开场白
      </div>
    ),
    children: (
      <div className={`${clsPrefix}-body`}>
        <PromptEditor
          placeholder="请输入开场白"
          className={`${clsPrefix}-textarea`}
          value={agent.openingSpeech}
          onChange={(value) => {
            agent.openingSpeech = value;
          }}
          variableBlock={{
            show: true,
            variables: [],
          }}
        />
      </div>
    ),
  });

  const [activeKey, setActiveKey] = useState<string[]>([]);

  useEffect(() => {
    const keys = [];
    if (prompt?.introduction !== undefined) {
      keys.push('introduction');
    }
    if (prompt?.target !== undefined) {
      keys.push('target');
    }
    if (prompt?.instruction !== undefined) {
      keys.push('instruction');
    }
    if (agent.openingSpeech !== undefined) {
      keys.push('openingSpeech');
    }
    setActiveKey(keys);
  }, [prompt?.introduction, prompt?.target, prompt?.instruction, agent.openingSpeech]);
  return (
    <div className={`${clsPrefix}-container`}>
      <Collapse
        className={`${clsPrefix}-container-collapse`}
        activeKey={activeKey}
        ghost
        items={items}
        onChange={(key) => setActiveKey(typeof key === 'string' ? [key] : key)}
      />
    </div>
  );
});
