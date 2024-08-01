import { CaretDownOutlined } from '@ant-design/icons';
import {
  BaseView,
  ViewInstance,
  inject,
  singleton,
  useInject,
  view,
} from '@difizen/mana-app';
import { Button, Form, Select, Popover } from 'antd';
import { forwardRef, useEffect } from 'react';

import './index.less';
import type { ModelMeta } from '../../../modules/model/index.js';
import { ModelManager } from '../../../modules/model/index.js';
import { BotProvider } from '../bot-provider.js';

const viewId = 'bot-config-model-selector';

const ModelSelectorOption = (props: { model: ModelMeta }) => {
  const { model } = props;
  return (
    <div className={`${viewId}-option`}>
      <img className={`${viewId}-option-icon`} src={model.icon} />
      <span className={`${viewId}-option-label`}>{model.name}</span>
    </div>
  );
};

const ModelSelectorComponent = forwardRef<HTMLDivElement>(
  function ModelSelectorComponent(props, ref) {
    const instance = useInject<ModelSelectorView>(ViewInstance);
    const modelManager = useInject(ModelManager);
    const defaultModel = modelManager.defaultModel;

    const bot = instance.botProvider.current;

    const modelMeta = bot?.draft?.model;

    const models = modelManager.models;

    useEffect(() => {
      if (!modelMeta && defaultModel) {
        instance.botProvider.ready
          .then(async (bot) => {
            await bot.draftReady;
            if (!bot.draft!.model) {
              instance.onSelectChange(defaultModel.key);
            }
            return;
          })
          .catch(console.error);
      }
    }, [modelMeta, defaultModel, instance]);

    const currentModel = models.find((item) => item.key === bot?.draft?.model?.key);

    return (
      <div ref={ref} className={viewId}>
        <Popover
          rootClassName={`${viewId}-popover`}
          arrow={false}
          placement="bottomLeft"
          title="模型设置"
          trigger="click"
          content={
            <div className={`${viewId}-popover-content`}>
              <Form layout="vertical">
                <Form.Item label="模型">
                  <Select
                    onSelect={instance.onSelectChange}
                    value={bot?.draft?.model?.key}
                  >
                    {models.map((item) => (
                      <Select.Option key={item.key} value={item.key}>
                        <ModelSelectorOption model={item} />
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>
            </div>
          }
        >
          <Button
            size="small"
            className={`${viewId}-btn`}
            iconPosition="end"
            icon={<CaretDownOutlined />}
          >
            {currentModel ? <ModelSelectorOption model={currentModel} /> : null}
          </Button>
        </Popover>
      </div>
    );
  },
);

@singleton()
@view(viewId)
export class ModelSelectorView extends BaseView {
  @inject(BotProvider) botProvider: BotProvider;
  override view = ModelSelectorComponent;

  onSelectChange = async (modelKey: string) => {
    const draft = this.botProvider.current?.draft;
    if (draft) {
      draft.model = { key: modelKey };
    }
  };
}
