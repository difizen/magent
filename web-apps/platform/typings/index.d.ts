interface Window {
  __webpack_public_path__: string;
  publicPath: string;
  routerBase?: string;
  __webpack_require__: any;
}

interface Pagination<T = any> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}
