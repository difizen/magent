export default [
  {
    path: '/',
    redirect: '/chat',
  },
  {
    path: '/chat',
    slot: 'magent-langchain-chat-slot',
  },
];
