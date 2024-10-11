import { capitalizeFirstLetter } from '@flow/utils/basic.js';
import { memo } from 'react';

export const OutputVariable = memo(function Variable(props: {
  name: string;
  type: string;
}) {
  const { name, type } = props;
  return (
    <div className="flex">
      <div className="font-medium">{name}</div>
      <div className="ml-2 rounded-lg bg-gray-200 px-2">
        {capitalizeFirstLetter(type)}
      </div>
    </div>
  );
});
