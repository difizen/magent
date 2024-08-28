import { CaretDownOutlined } from '@ant-design/icons';
import { ViewInstance, useInject, useObserve } from '@difizen/mana-app';
import type { SliderSingleProps } from 'antd';
import { Button, Form, Select, Popover, Avatar, Slider } from 'antd';
import type { FC } from 'react';
import { forwardRef, useEffect } from 'react';

import type { LLMProvider } from '@/modules/model/llm-model.js';
import { LLMProviderManager } from '@/modules/model/llm-provider-manager.js';
import { LLMIcon } from '@/modules/model/model-icon/index.js';
import type { LLMMeta } from '@/modules/model/protocol.js';

import type { AgentConfigView } from '../../view.js';

import './index.less';

const clsPrefix = 'agent-config-model-selector';

const ModelSelectorOption = (props: { model: LLMMeta; flat?: boolean }) => {
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

const toKey = (model?: LLMMeta) => {
  if (!model) {
    return undefined;
  }
  return model.id + model.model_name[0];
};

interface TemperatureSliderProps extends SliderSingleProps {
  llm?: LLMProvider;
}
const TemperatureSlider: FC<TemperatureSliderProps> = (
  props: TemperatureSliderProps,
) => {
  const llm = useObserve(props.llm);
  const temperature = llm?.temperature;
  return (
    <Slider
      {...props}
      step={0.01}
      min={0}
      max={1}
      onChange={(v) => {
        if (llm) {
          llm.temperature = v;
        }
      }}
      value={temperature === undefined ? 1 : temperature}
    />
  );
};

export const ModelSelector = forwardRef<HTMLDivElement>(
  function ModelSelectorComponent(props, ref) {
    const instance = useInject<AgentConfigView>(ViewInstance);
    const modelProviderManager = useInject(LLMProviderManager);

    const modelMeta = instance.agent?.llm;

    const models = modelProviderManager.models;

    const metaModels = models
      .map((item) => item.toSingleMetas())
      .filter((item) => !!item)
      .flat() as LLMMeta[];

    useEffect(() => {
      modelProviderManager.updateProviders();
    }, [modelProviderManager]);

    const currentModel = metaModels.find(
      (item) => modelMeta && toKey(item) === toKey(modelMeta),
    );

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
                        instance.agent.llm = modelProviderManager.getOrCreate(llm);
                      }
                    }}
                    value={toKey(instance.agent.llm?.toMeta())}
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
                  <TemperatureSlider llm={instance.agent.llm} />
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
