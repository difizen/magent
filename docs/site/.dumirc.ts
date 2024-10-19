import { defineConfig } from 'dumi';

export default defineConfig({
  themeConfig: {
    hd: { rules: [] },
    name: 'magent',
    link: '/',
    logo: '/logo.svg',
    nav: [
      { title: '介绍', link: '/introduction' },
      { title: '教程', link: '/tutorial' },
      { title: '示例', link: '/examples' },
      { title: 'AU', link: '/au' },
    ],
    gitRepo: { owner: 'difizen', name: 'magent' },
    qrcodes: [
      {
        name: '钉钉',
        qrcode: '/magent-dingding-group.png',
      },
    ],
    banner: {
      title: 'magent',
      desc: '你需要的 agent 产品方案',
    },
    footer: `Open-source MIT Licensed | Copyright © 2023-present`,
    groupQR:
      'https://mdn.alipayobjects.com/huamei_hdnzbp/afts/img/A*udAwToe7HUQAAAAAAAAAAAAADjOxAQ/original',
    linksTitle: 'Difizen | magent',
    links: [
      {
        title: '资源',
        itemList: [
          {
            name: 'Difizen',
            link: 'https://github.com/difizen',
          },
          {
            name: 'mana',
            link: 'https://github.com/difizen/mana',
          },
          {
            name: 'libro',
            link: 'https://github.com/difizen/libro',
          },
          {
            name: 'magent',
            link: 'https://github.com/difizen/magent',
          },
        ],
      },
      {
        title: '社区',
        itemList: [
          {
            name: '提交反馈',
            link: 'https://github.com/difizen/magent/issues',
          },
          {
            name: '发布日志',
            link: 'https://github.com/difizen/magent/releases',
          },
        ],
      },
    ],
    techCardData: [],
  },
  favicons: ['/logo.svg'],
  plugins: ['@difizen/umi-plugin-mana', './dumi-plugin-alias'],
  mana: {
    decorator: true,
    nodenext: true,
  },
  exportStatic: {},
  resolve: {
    docDirs: ['docs'],
    codeBlockMode: 'passive',
  },

  // dev
  proxy: {
    // au api
    '/api': {
      target: 'http://localhost:8888/',
      changeOrigin: true,
      secure: false,
      pathRewrite: {},
      ws: true,
    },
    '/resources': {
      target: 'http://localhost:8888/',
      changeOrigin: true,
      secure: false,
      pathRewrite: {},
      ws: true,
    },
  },
});
