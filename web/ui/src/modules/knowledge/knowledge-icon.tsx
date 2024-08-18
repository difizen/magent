import { BookTwoTone } from '@ant-design/icons';
import type { AvatarProps } from 'antd';
import { Avatar } from 'antd';

import { toResourceUrl } from '../../common/page-config.js';

interface IProps extends AvatarProps {
  data: { avatar?: string; id?: string };
}
export const KnowledgeIcon = (props: IProps) => {
  if (props.data.avatar) {
    return <Avatar {...props} src={toResourceUrl(props.data.avatar)} />;
  }
  return <Avatar {...props} src={<BookTwoTone />} />;
};
