import { InputNumber, Slider } from 'antd';

export const DecimalStep = (props: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) => {
  const { min, max, step, value, onChange } = props;

  return (
    <div className="flex justify-between">
      <Slider
        style={{ flex: 1 }}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        value={typeof value === 'number' ? value : 0}
      />

      <InputNumber
        style={{ marginLeft: '8px' }}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange as any}
      />
    </div>
  );
};
