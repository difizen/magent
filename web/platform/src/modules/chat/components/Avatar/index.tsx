import './index.less';

interface AvatarProps {
  workNo?: string;
  url?: string;
}
export const Avatar = (props: AvatarProps) => {
  const src =
    props.url ||
    `https://antwork.antgroup-inc.cn/photo/${props.workNo}.${64}x${64}.jpg`;

  return <img className={'chat-user-avatar'} src={src} />;
};
