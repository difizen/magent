import { capitalizeFirstLetter } from '@flow/utils/basic.js';

export const OutputVariable = (props: { name: string; type: string }) => {
  const { name, type } = props;
  return (
    <div className="flex">
      <div className="font-medium">{name}</div>
      <div className="ml-2 rounded-lg bg-gray-200 px-2">
        {capitalizeFirstLetter(type)}
      </div>
    </div>
  );
};
