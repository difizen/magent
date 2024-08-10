interface Portal {
  path: string;
  label: string;
}

export const portals: Portal[] = [
  {
    path: 'agents',
    label: 'Agents',
  },
  {
    path: 'tools',
    label: 'Tools',
  },
  {
    path: 'knowledge',
    label: 'Knowledge',
  },
  // {
  //   path: 'debug',
  //   label: 'Debug',
  // },
];
