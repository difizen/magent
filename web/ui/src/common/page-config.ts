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
  const pageConfig = getPageConfig();
  if (pageConfig['resource_path']) {
    return url.replace('/resources', pageConfig['resource_path']);
  }
  return url;
}
