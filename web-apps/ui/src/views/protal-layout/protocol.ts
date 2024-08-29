interface Portal {
  path: string;
  label: string;
}

export const portals: Portal[] = [
  {
    path: 'agents',
    label: '智能体',
  },
  {
    path: 'tools',
    label: '工具',
  },
  {
    path: 'plugins',
    label: '插件',
  },
  {
    path: 'knowledge',
    label: '知识',
  },
  // {
  //   path: 'debug',
  //   label: 'Debug',
  // },
];
