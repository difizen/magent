import { defineConfig } from 'umi';

import routes from './routes';

class ExposeWebpackRequirePlugin {
  apply(compiler: any) {
    compiler.hooks.compilation.tap('ExposeWebpackRequirePlugin', (compilation: any) => {
      compilation.mainTemplate.hooks.require.tap(
        'ExposeWebpackRequirePlugin',
        (source: any) => {
          return `
            window.__webpack_require__ = __webpack_require__;
            ${source}
          `;
        },
      );
    });
  }
}

export default defineConfig({
  publicPath: '/',
  routes: routes,
  runtimePublicPath: {},
  proxy: {
    '/api': {
      target: 'http://localhost:9563/',
      changeOrigin: true,
      secure: false,
      pathRewrite: {},
      ws: true,
    },
    '/resources': {
      target: 'http://localhost:9563/',
      changeOrigin: true,
      secure: false,
      pathRewrite: {},
      ws: true,
    },
  },
  extraBabelPlugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-transform-flow-strip-types', { allowDeclareFields: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
    ['@babel/plugin-transform-class-properties', { loose: true }],
    'babel-plugin-parameter-decorator',
  ],
  chainWebpack: (memo: any) => {
    memo.plugin('expose-webpack-require').use(ExposeWebpackRequirePlugin);
  },
  plugins: [
    './config/dumi-plugin-nodenext',
    './config/umi-plugin-router',
    './config/umi-plugin-mana',
  ],
  mfsu: false,
  jsMinifier: 'none',
  favicons: ['/favicon.ico'],
});
