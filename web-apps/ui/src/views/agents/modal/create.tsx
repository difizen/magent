import path from 'path';

import type { ModalItem, ModalItemProps } from '@difizen/mana-app';
import type { FormInstance } from 'antd';
import { Button, Form, Input, Space } from 'antd';
import { Modal } from 'antd';
import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';

import { AvatarUpload } from '@/components/avatar-upload/index.js';
import { AgentIcon } from '@/modules/agent/agent-icon.js';

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
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);

  return (
    <Button type="primary" htmlType="submit" disabled={!submittable}>
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
  const { visible, close } = props;
  const [form] = Form.useForm();
  const [idValue, setId] = useState<string | undefined>(undefined);

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
        name="validateOnly"
        layout="vertical"
        autoComplete="off"
        onFieldsChange={(changed) => {
          const idChanged = changed.find(
            (item) =>
              item.name instanceof Array &&
              item.name.length === 1 &&
              item.name[0] === 'id',
          );
          if (idChanged && idChanged.validated) {
            setId(idChanged.value);
          }
        }}
      >
        <Form.Item name="id" label="id" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="nickname" label="名称" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
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
          <Input.TextArea />
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
