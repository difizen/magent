import { CaretDownOutlined } from '@ant-design/icons';
import { ViewInstance, useInject } from '@difizen/mana-app';
import { Button, Form, Select, Popover, Avatar, Slider } from 'antd';
import { forwardRef, useEffect } from 'react';

import { LLMManager } from '../../../../modules/model/llm-manager.js';
import type { ModelMeta } from '../../../../modules/model/protocol.js';
import type { AgentConfigView } from '../../view.js';

import './index.less';
import { DefaultLogo, OpenAILogo, QwenLogo } from './logos.js';

const clsPrefix = 'agent-config-model-selector';

const LLMIcon = (props: { data: ModelMeta }) => {
  const { data } = props;
  if (
    data.id.toLowerCase().includes('qwen') ||
    data.nickname.toLowerCase().includes('qwen') ||
    data.model_name[0].toLowerCase().includes('qwen')
  ) {
    return <QwenLogo />;
  }
  if (
    data.id.toLowerCase().includes('openai') ||
    data.nickname.toLowerCase().includes('openai') ||
    data.model_name[0].toLowerCase().includes('openai')
  ) {
    return <OpenAILogo />;
  }
  return <DefaultLogo />;
};

const ModelSelectorOption = (props: { model: ModelMeta; flat?: boolean }) => {
  const { model, flat } = props;
  return (
    <div className={`${clsPrefix}-option`}>
      <Avatar
        size="small"
        className={`${clsPrefix}-option-icon`}
        src={<LLMIcon data={model} />}
      />
      {flat && <span className={`${clsPrefix}-option-series`}>{model.nickname}</span>}
      <span className={`${clsPrefix}-option-label`}>{model.model_name[0]}</span>
    </div>
  );
};

const toKey = (model?: ModelMeta) => {
  if (!model) {
    return undefined;
  }
  return model.id + model.model_name[0];
};

export const ModelSelector = forwardRef<HTMLDivElement>(
  function ModelSelectorComponent(props, ref) {
    const instance = useInject<AgentConfigView>(ViewInstance);
    const modelManager = useInject(LLMManager);
    // const defaultModel = modelManager.defaultModel;

    const modelMeta = instance.agent?.llm;

    const models = modelManager.models;

    const metaModels = models
      .map((item) => item.toSingleMetas())
      .filter((item) => !!item)
      .flat() as ModelMeta[];

    useEffect(() => {
      modelManager.updateModels();
    }, [modelManager]);

    const currentModel = metaModels.find(
      (item) => modelMeta && toKey(item) === toKey(modelMeta),
    );

    const temperature = instance.agent.llm?.temperature;

    return (
      <div ref={ref} className={clsPrefix}>
        <Popover
          rootClassName={`${clsPrefix}-popover`}
          arrow={false}
          placement="bottomLeft"
          title="模型设置"
          trigger="click"
          content={
            <div className={`${clsPrefix}-popover-content`}>
              <Form layout="vertical">
                <Form.Item label="模型">
                  <Select
                    onSelect={(v) => {
                      const llm = metaModels.find((i) => toKey(i) === v);
                      if (instance.agent.llm && llm) {
                        instance.agent.llm = llm;
                      }
                    }}
                    value={toKey(instance.agent.llm)}
                  >
                    {models.map((model) => (
                      <Select.OptGroup key={model.id} label={model.name}>
                        {model
                          .toSingleMetas()
                          .filter((i) => !!i)
                          .map((item) => (
                            <Select.Option key={toKey(item)} value={toKey(item)}>
                              <ModelSelectorOption model={item!} />
                            </Select.Option>
                          ))}
                      </Select.OptGroup>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="temperature">
                  <Slider
                    step={0.01}
                    min={0}
                    max={1}
                    onChange={(v) => {
                      if (instance.agent.llm) {
                        instance.agent.llm.temperature = v;
                      }
                    }}
                    value={temperature === undefined ? 1 : temperature}
                  />
                </Form.Item>
              </Form>
            </div>
          }
        >
          <Button
            size="small"
            className={`${clsPrefix}-btn`}
            iconPosition="end"
            icon={<CaretDownOutlined />}
          >
            {currentModel ? <ModelSelectorOption flat model={currentModel} /> : null}
          </Button>
        </Popover>
      </div>
    );
  },
);