import { CaretDownOutlined } from '@ant-design/icons';
import { useInject } from '@difizen/mana-app';
import { Button, Form, Select, Popover, Avatar } from 'antd';
import { forwardRef, useEffect } from 'react';

import { LLMProviderManager } from '@/modules/model/llm-provider-manager.js';
import { LLMIcon } from '@/modules/model/model-icon/index.js';
import type { LLMMeta } from '@/modules/model/protocol.js';

import { DecimalStep } from '../decimal-step/index.js';
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

export const ModelSelector = forwardRef<
  HTMLDivElement,
  {
    value?: LLMMeta;
    onChange?: (value: LLMMeta) => void;
  }
>(function ModelSelectorComponent(
  props: {
    value?: LLMMeta;
    onChange?: (value: LLMMeta) => void;
  },
  ref,
) {
  const { value, onChange } = props;

  const modelManager = useInject(LLMProviderManager);
  // const defaultModel = modelManager.defaultModel;

  const models = modelManager.models;

  const metaModels = models
    .map((item) => item.toSingleMetas())
    .filter((item) => !!item)
    .flat() as LLMMeta[];

  useEffect(() => {
    modelManager.updateProviders();
  }, [modelManager]);

  const currentModel = metaModels.find((item) => value && toKey(item) === toKey(value));

  const temperature = value?.temperature;

  return (
    <div ref={ref} className={clsPrefix}>
      <Popover
        rootClassName={`${clsPrefix}-popover`}
        getPopupContainer={(triggerNode) => triggerNode.parentElement!}
        arrow={false}
        placement="bottomLeft"
        title="模型设置"
        trigger="click"
        content={
          <div className={`${clsPrefix}-popover-content`}>
            <Form layout="vertical">
              <Form.Item label="模型">
                <Select
                  className="nodrag nowheel"
                  placeholder="请选择模型"
                  getPopupContainer={(triggerNode) => triggerNode.parentElement}
                  onSelect={(v) => {
                    const llm = metaModels.find((i) => toKey(i) === v);
                    if (llm) {
                      onChange?.(llm);
                    }
                  }}
                  value={toKey(value)}
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
                <DecimalStep
                  step={0.01}
                  min={0}
                  max={1}
                  onChange={(v) => {
                    if (value) {
                      onChange?.({
                        ...value,
                        temperature: v,
                      });
                    }
                  }}
                  value={temperature === undefined ? 1 : Number(temperature)}
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
});
