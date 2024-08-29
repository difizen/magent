import { Button } from 'antd';

import transferIcon from '../icons/transfer.svg';

export const TransferButton = (props: {
  icon?: string;
  onClick: () => void;
  children?: React.ReactNode;
}) => {
  const { icon = transferIcon, onClick, children } = props;
  return (
    <Button
      className="bg-gray-50"
      type="text"
      icon={<img src={icon} className="h-6" />}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
