import './index.less';
import {
  ContactsTwoTone,
  HighlightTwoTone,
  ScheduleTwoTone,
  SoundTwoTone,
} from '@ant-design/icons';
import { useInject, ViewInstance } from '@difizen/mana-app';
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';

import type { AgentConfigView } from '../../view.js';

import { TextArea } from './textarea.js';

const clsPrefix = 'character-settings';

export const CharacterSetting = () => {
  const instance = useInject<AgentConfigView>(ViewInstance);
  const agent = instance.agent;
  const prompt = agent.prompt;

  const items: CollapseProps['items'] = [
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
          <TextArea
            value={prompt.introduction}
            onChange={(e) => {
              prompt.introduction = e.target.value;
            }}
            className={`${clsPrefix}-textarea`}
          ></TextArea>
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
          <TextArea
            value={prompt.target}
            onChange={(e) => {
              prompt.target = e.target.value;
            }}
            className={`${clsPrefix}-textarea`}
          ></TextArea>
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
          <TextArea
            value={prompt.instruction}
            onChange={(e) => {
              prompt.instruction = e.target.value;
            }}
            className={`${clsPrefix}-textarea`}
          ></TextArea>
        </div>
      ),
    },
    {
      key: 'openingSpeech',
      label: (
        <div className={`${clsPrefix}-label`}>
          <SoundTwoTone style={{ marginRight: 8 }} />
          开场白
        </div>
      ),
      children: (
        <div className={`${clsPrefix}-body`}>
          <TextArea
            value={agent.openingSpeech}
            onChange={(e) => {
              agent.openingSpeech = e.target.value;
            }}
            className={`${clsPrefix}-textarea`}
          ></TextArea>
        </div>
      ),
    },
  ];
  const defaultActiveKey = [];
  if (prompt.introduction) {
    defaultActiveKey.push('introduction');
  }
  if (prompt.target) {
    defaultActiveKey.push('target');
  }
  if (prompt.instruction) {
    defaultActiveKey.push('instruction');
  }
  if (agent.openingSpeech) {
    defaultActiveKey.push('openingSpeech');
  }

  return (
    <div className={`${clsPrefix}-container`}>
      <Collapse
        className={`${clsPrefix}-container-collapse`}
        defaultActiveKey={['introduction', 'target', 'instruction', 'openingSpeech']}
        ghost
        items={items}
      />
    </div>
  );
};
