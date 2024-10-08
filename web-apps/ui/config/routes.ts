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
      {
        path: '/agent',
        slot: 'magent-agent-slot',
        redirect: '/portal/agents',
      },
      {
        path: '/agent/:agentId/chat',
        slot: 'magent-agent-chat-slot',
      },
      {
        path: '/agent/:agentId/dev',
        slot: 'magent-agent-dev-slot',
      },
      {
        path: '/agent/:agentId/flow',
        slot: 'magent-agent-flow-dev-slot',
      },
      {
        path: '/portal/knowledge/:knowledgeId/upload',
        slot: 'magent-knowledge-upload-slot',
      },
    ],
  },
];
