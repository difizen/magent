import * as path from 'path';

import { getPageConfig } from './common/page-config.js';

function initPublicPath() {
  const url = new URL((document.currentScript as HTMLScriptElement).src);
  const cdn = url.origin + path.join(url.pathname, '../');
  window.__webpack_public_path__ = cdn;
  window.publicPath = cdn;
  if (window.__webpack_require__) {
    window.__webpack_require__.p = window.publicPath || '/';
  }

  const pageConfig = getPageConfig();
  const baseUrl = pageConfig['baseUrl'];
  if (baseUrl && baseUrl.startsWith('/')) {
    window.routerBase = baseUrl;
  }
}

initPublicPath();
