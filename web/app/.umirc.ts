import { defineConfig } from 'umi';
import routes from './routes';
export default defineConfig({
  publicPath: '/',
  routes: routes,
  runtimePublicPath: {},
  proxy: {
    '/api': {
      target: 'http://localhost:8000/',
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
  plugins: ['./dumi-plugin-nodenext', './umi-plugin-router'],
  mfsu: false,
  jsMinifier: 'none',
});
