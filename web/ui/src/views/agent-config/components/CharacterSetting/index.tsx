import './index.less';
import { HighlightTwoTone } from '@ant-design/icons';
import { Input } from 'antd';

const clsPrefix = 'character-settings';

export const CharacterSetting = ({
  values = {
    introduction: '',
    target: '',
    instruction: '',
  },
  onChange,
}: {
  values: {
    introduction: string;
    target: string;
    instruction: string;
  };
  onChange: (values: {
    introduction: string;
    target: string;
    instruction: string;
  }) => void;
}) => {
  const { introduction, target, instruction } = values;
  return (
    <div className={`${clsPrefix}-container`}>
      <div className={`${clsPrefix}-header`}>
        <HighlightTwoTone style={{ marginRight: 8 }} />
        人设
      </div>
      <div className={`${clsPrefix}-body`}>
        <Input.TextArea
          value={instruction}
          onChange={(e) => {
            onChange({
              ...values,
              instruction: e.target.value,
            });
          }}
          className={`${clsPrefix}-textarea`}
        ></Input.TextArea>
      </div>
      <div className={`${clsPrefix}-header`}>
        <HighlightTwoTone style={{ marginRight: 8 }} />
        目标
      </div>
      <div className={`${clsPrefix}-body`}>
        <Input.TextArea
          value={target}
          onChange={(e) => {
            onChange({
              ...values,
              target: e.target.value,
            });
          }}
          className={`${clsPrefix}-textarea`}
        ></Input.TextArea>
      </div>
      <div className={`${clsPrefix}-header`}>
        <HighlightTwoTone style={{ marginRight: 8 }} />
        要求
      </div>
      <div className={`${clsPrefix}-body`}>
        <Input.TextArea
          value={introduction}
          onChange={(e) => {
            onChange({
              ...values,
              introduction: e.target.value,
            });
          }}
          className={`${clsPrefix}-textarea`}
        ></Input.TextArea>
      </div>
    </div>
  );
};
