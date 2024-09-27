import { Popup } from './index.js';

export interface PopItemProps {
  title?: string;
  extra?: string;
  description?: string;
  isDivider?: boolean;
  onClick?: () => void;
}

export const PopItems = (props: {
  children: React.ReactNode;
  items: PopItemProps[];
  footer?: React.ReactNode;
}) => {
  const { children, items } = props;
  return (
    <Popup
      content={
        <div>
          {items.map(() => {
            return <div key="title"></div>;
          })}
          {footer}
        </div>
      }
    >
      {children}
    </Popup>
  );
};
