import type { AvatarProps } from 'antd';
import { Avatar } from 'antd';

import { toResourceUrl } from '../../common/page-config.js';

interface IProps extends AvatarProps {
  data: { avatar?: string; id?: string };
}
export const ToolIcon = (props: IProps) => {
  if (props.data.avatar) {
    return <Avatar {...props} src={toResourceUrl(props.data.avatar)} />;
  }
  return <Avatar {...props} src={<DefaultToolIcon />} />;
};

export const DefaultToolIcon = () => {
  return (
    <svg
      className="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
    >
      <path
        d="M682.666667 170.666667l21.333333 42.666666v320h128V213.333333l23.04-42.666666L832 64h-128l-21.333333 106.666667z"
        fill="#90A4AE"
      ></path>
      <path
        d="M768 192c62.506667 0 64-128 64-128h-128s1.706667 128 64 128z"
        fill="#B0BEC5"
      ></path>
      <path
        d="M680.746667 533.333333h174.506666l38.826667 183.253334a81.92 81.92 0 0 1 1.92 17.706666V874.666667a85.333333 85.333333 0 0 1-85.333333 85.333333h-85.333334a85.333333 85.333333 0 0 1-85.333333-85.333333v-140.373334a81.92 81.92 0 0 1 1.92-17.706666z"
        fill="#3F51B5"
      ></path>
      <path
        d="M661.333333 448m21.333334 0l170.666666 0q21.333333 0 21.333334 21.333333l0 42.666667q0 21.333333-21.333334 21.333333l-170.666666 0q-21.333333 0-21.333334-21.333333l0-42.666667q0-21.333333 21.333334-21.333333Z"
        fill="#5C6BC0"
      ></path>
      <path
        d="M234.666667 359.04V832a128 128 0 0 0 256 0V359.04zM362.666667 896a64 64 0 1 1 64-64 64 64 0 0 1-64 64z"
        fill="#FF9800"
      ></path>
      <path
        d="M490.666667 410.666667H234.666667v45.44l256 87.893333v-133.333333z"
        fill="#EF6C00"
      ></path>
      <path
        d="M466.986667 85.333333v209.92h-208.64V85.333333A234.666667 234.666667 0 0 0 128 294.186667 177.92 177.92 0 0 0 277.333333 469.333333a528 528 0 0 0 85.333334 7.253334 528 528 0 0 0 85.333333-7.253334 177.92 177.92 0 0 0 149.333333-175.36A234.666667 234.666667 0 0 0 466.986667 85.333333z"
        fill="#FF9800"
      ></path>
    </svg>
  );
};
