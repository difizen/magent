import path from 'path';

import { Fetcher } from '@difizen/magent-core';
import type { ModalItem, ModalItemProps } from '@difizen/mana-app';
import { useInject } from '@difizen/mana-app';
import type { FormInstance } from 'antd';
import { Button, Form, Input, Space } from 'antd';
import { Modal } from 'antd';
import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';

import { AgentIcon } from '../../../agent/agent-icon.js';
import { AgentManager } from '../../../agent/agent-manager.js';
import { AgentMarket } from '../../../agent/agent-market.js';
import { RouterHistory } from '../../../common/router.js';
import { AgentTypeSelector } from '../../../components/agent-type-selector/index.js';
import { AvatarUpload } from '../../../components/avatar-upload/index.js';
import { LLMManager } from '../../../model/llm-manager.js';
import { ModelSelector } from '../../../model/model-selector/index.js';
import type { LLMMeta } from '../../../model/protocol.js';

import './index.less';

interface SubmitButtonProps {
  form: FormInstance;
}

const SubmitButton: React.FC<PropsWithChildren<SubmitButtonProps>> = (
  props: PropsWithChildren<SubmitButtonProps>,
) => {
  const { form, children } = props;
  const [submittable, setSubmittable] = useState<boolean>(false);

  const values = Form.useWatch([], form);

  useEffect(() => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  return (
    <Button
      onClick={() => form.submit()}
      type="primary"
      htmlType="submit"
      disabled={!submittable}
    >
      {children}
    </Button>
  );
};

const UploadButton = (props: { imageUrl?: string }) => {
  const { imageUrl } = props;
  return imageUrl ? (
    <AgentIcon
      className="magent-agents-modal-avatar-uploader-content-icon"
      agent={{ avatar: imageUrl }}
    />
  ) : (
    <AgentIcon className="magent-agents-modal-avatar-uploader-content-icon magent-agents-modal-avatar-uploader-content-default-icon" />
  );
};

export const AgentModalComponent = (props: ModalItemProps<any>) => {
  const agentManager = useInject(AgentManager);
  const llmManager = useInject(LLMManager);
  const req = useInject(Fetcher);
  const market = useInject(AgentMarket);
  const history = useInject(RouterHistory);
  const { visible, close } = props;
  const [form] = Form.useForm<{
    id: string;
    plannerId: string;
    avatar?: string;
    nickname: string;
    description?: string;
    llm: LLMMeta;
  }>();
  const idValue = Form.useWatch('id', form);
  const plannerValue = Form.useWatch('plannerId', form);
  useEffect(() => {
    llmManager
      .updateFromProvider()
      .then(() => {
        if (form.getFieldValue('llm') === undefined && llmManager.default) {
          form.setFieldValue('llm', llmManager.default.toMeta());
        }
        return;
      })
      .catch(console.error);
  }, [llmManager, form]);

  return (
    <Modal
      className="magent-agents-modal"
      open={visible}
      onCancel={() => close()}
      width={640}
      title="新建智能体"
      footer={
        <Space>
          <Button htmlType="reset" onClick={close}>
            取消
          </Button>
          <SubmitButton form={form}>确认</SubmitButton>
        </Space>
      }
    >
      <Form
        className="magent-agents-modal-create-form"
        form={form}
        layout="vertical"
        autoComplete="off"
        onFinish={async (values) => {
          const meta = {
            id: values.id,
            nickname: values.nickname,
            avatar: values.avatar,
            description: values.description,
            prompt: { instruction: '', introduction: '', target: '' },
            planner: { id: values.plannerId, nickname: '' },
            llm: values.llm,
            // llm: llmManager.default,
          };
          const res = await agentManager.create(meta);
          if (res.status === 200) {
            close();
            market.update();
            history.push(
              `/agent/${meta.id}/${meta.planner.id === 'workflow_planner' ? 'flow' : 'dev'}`,
            );
          }
        }}
        onFinishFailed={console.error}
        initialValues={{ plannerId: 'rag_planner' }}
      >
        <Form.Item
          name="plannerId"
          label="想创建哪种类型的智能体？"
          rules={[{ required: true }]}
        >
          <AgentTypeSelector />
        </Form.Item>
        <Form.Item
          name="id"
          label="id"
          rules={[
            { required: true },
            () => ({
              async validator(_, value) {
                const res = await req.get<boolean>(`/api/v1/common/is_id_unique`, {
                  id: value,
                  type: 'agent',
                });
                if (res.status !== 200 || res.data === false) {
                  throw new Error(`${value} 已存在，请更换其他 id`);
                }
              },
            }),
          ]}
        >
          <Input placeholder="给智能体一个独一无二的 id" />
        </Form.Item>
        <Form.Item name="nickname" label="名称" rules={[{ required: true }]}>
          <Input placeholder="给你的智能体起个名字" />
        </Form.Item>
        {plannerValue !== 'workflow_planner' && (
          <Form.Item name="llm" label="模型" rules={[{ required: true }]}>
            <ModelSelector showConfig={false} popoverMode={false} />
          </Form.Item>
        )}
        <Form.Item name="avatar" label="头像">
          <AvatarUpload
            disabled={!idValue}
            data={(file) => {
              const extname = path.extname(file.name);
              const filename = `${idValue}${extname}`;
              return {
                file,
                filename,
              };
            }}
            AvatarRender={UploadButton}
          />
        </Form.Item>
        <Form.Item name="description" label="描述" rules={[]}>
          <Input.TextArea placeholder="介绍一下你的智能体吧" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const agentCreateModalId = 'magent-agent-creation';
export const AgentCreateModal: ModalItem = {
  id: agentCreateModalId,
  component: AgentModalComponent,
};
