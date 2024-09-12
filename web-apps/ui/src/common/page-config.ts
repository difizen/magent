export function getPageConfig() {
  const el = document.getElementById('mana-config-data');
  if (el) {
    try {
      const pageConfig = JSON.parse(el.textContent || '') as Record<string, string>;
      return pageConfig;
    } catch (e) {
      console.warn('Can not get page config');
    }
  }
  return {};
}

export function toResourceUrl(url: string) {
  const resourcePart = url.substring(url.indexOf('resources'), url.length);
  const pageConfig = getPageConfig();
  const baseUrl = pageConfig['baseUrl'] || '/';
  let resourceUrl = pageConfig['resourceUrl'];
  if (!resourceUrl) {
    resourceUrl = `${baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`}resources`;
  }
  let resourcePath = resourceUrl;
  if (resourcePath.endsWith('/')) {
    resourcePath = resourcePath.substring(0, resourcePath.length - 1);
  }
  return resourcePart.replace('resources', resourcePath);
}
