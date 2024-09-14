import { CaretDownOutlined } from '@ant-design/icons';
import { useInject, useObserve } from '@difizen/mana-app';
import type { SliderSingleProps } from 'antd';
import { Button, Form, Select, Popover, Avatar, Slider } from 'antd';
import type { FC } from 'react';
import { useState } from 'react';
import { forwardRef, useEffect } from 'react';

import { DecimalStep } from '@/components/decimal-step/index.js';
import { LLMModel } from '@/modules/model/llm-model.js';
import { LLMProviderManager } from '@/modules/model/llm-provider-manager.js';
import { LLMIcon } from '@/modules/model/model-icon/index.js';
import type { LLMMeta } from '@/modules/model/protocol.js';

import './index.less';

const clsPrefix = 'magent-llm-model-selector';

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
      <span className={`${clsPrefix}-option-label`}>
        {model.model_name[0] || model.nickname}
      </span>
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
  llm?: LLMMeta;
  onConfigChange?: (v: LLMMeta) => void;
}
const TemperatureSlider: FC<TemperatureSliderProps> = (
  props: TemperatureSliderProps,
) => {
  const llm = useObserve(props.llm);
  const temperature = llm?.temperature;
  return (
    <DecimalStep
      {...props}
      step={0.01}
      min={0}
      max={1}
      onChange={(v) => {
        if (llm) {
          llm.temperature = v;
          props.onConfigChange?.(llm);
        }
      }}
      value={temperature === undefined ? 1 : temperature}
    />
  );
};

interface ModelSelectorProps {
  value?: LLMMeta | LLMModel | string;
  onChange?: (v?: LLMMeta) => void;
  showConfig?: boolean;
  popoverMode?: boolean;
  onConfigChanged?: (v: LLMMeta) => void;
}

export const ModelSelector = forwardRef<HTMLDivElement, ModelSelectorProps>(
  function ModelSelectorComponent(props: ModelSelectorProps, ref) {
    const { showConfig = true, popoverMode = true } = props;
    const shouldShowConfig = popoverMode ? showConfig : false;
    const modelProvider = useInject(LLMProviderManager);
    const [stateValue, setStateValue] = useState<LLMMeta | undefined>(undefined);

    const models = modelProvider.models;

    const llms = models
      .map((item) => item.toSingleMetas())
      .filter((item) => !!item)
      .flat();

    const toLLM = (v: undefined | LLMMeta | string): LLMMeta | undefined => {
      if (v === undefined) {
        return v;
      }
      if (typeof v === 'string') {
        return llms.find((item) => toKey(item) === v);
      }
      return v;
    };

    const currentModel = toLLM(props.value) || stateValue;

    useEffect(() => {
      modelProvider.updateProviders();
    }, [modelProvider]);

    const select = (
      <Select
        onSelect={(v) => {
          const meta = llms.find((i) => toKey(i) === v);
          if (!meta) {
            setStateValue(meta);
            props.onChange?.(meta);
            return;
          }
          let value = meta;
          if (currentModel instanceof LLMModel) {
            currentModel.updateMeta(meta);
            value = currentModel;
          } else {
            value = {
              ...currentModel,
              temperature:
                currentModel?.temperature === undefined
                  ? meta.temperature
                  : currentModel.temperature,
              id: meta.id,
              nickname: meta.nickname,
              model_name: meta.model_name,
            };
          }
          setStateValue(value);
          props.onChange?.(value);
        }}
        value={toKey(currentModel)}
      >
        {models.map((model) => {
          const metas = model.toSingleMetas().filter((item): item is LLMMeta => !!item);
          if (model.models.length > 0) {
            return (
              <Select.OptGroup key={model.id} label={model.name}>
                {metas
                  .filter((i) => !!i)
                  .map((item) => (
                    <Select.Option key={toKey(item)} value={toKey(item)}>
                      <ModelSelectorOption model={item!} />
                    </Select.Option>
                  ))}
              </Select.OptGroup>
            );
          } else {
            const item = metas[0];
            if (!item) {
              return null;
            }
            return (
              <Select.Option key={item.id} value={toKey(item)}>
                <ModelSelectorOption model={item!} />
              </Select.Option>
            );
          }
        })}
      </Select>
    );
    if (!popoverMode) {
      return select;
    }

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
                <Form.Item label="模型">{select}</Form.Item>
                {shouldShowConfig && (
                  <Form.Item label="temperature">
                    <TemperatureSlider
                      onConfigChange={(v) => {
                        props.onConfigChanged?.(v);
                        props.onChange?.(v);
                      }}
                      llm={currentModel}
                    />
                  </Form.Item>
                )}
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
