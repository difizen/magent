import * as path from 'path';

function initPublicPath() {
  const url = new URL((document.currentScript as HTMLScriptElement).src);
  const cdn = url.origin + path.join(url.pathname, '../');
  window.__webpack_public_path__ = cdn;
  window.publicPath = cdn;
  if (window.__webpack_require__) {
    window.__webpack_require__.p = window.publicPath || '/';
  }

  const el = document.getElementById('mana-config-data');
  if (el) {
    const pageConfig = JSON.parse(el.textContent || '') as Record<string, string>;
    const baseUrl = pageConfig['baseUrl'];
    if (baseUrl && baseUrl.startsWith('/')) {
      window.routerBase = baseUrl;
    }
  }
}

initPublicPath();
