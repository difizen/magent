export default [
  {
    path: '/',
    redirect: '/portal',
  },
  {
    path: '/',
    slot: 'magent-base-layout-slot',
    routes: [
      {
        path: '/portal',
        slot: 'magent-portal-slot',
        redirect: '/portal/agents',
        keepQuery: true,
      },
      {
        path: '/portal/:portal',
        slot: 'magent-portal-slot',
      },
    ],
  },
];
