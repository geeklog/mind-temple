let browseCaches = {};

export function getBrowseCache(path: string) {
  return browseCaches[path];
}

export function addBrowseCache(path: string, file: any) {
  browseCaches[path] = file;
}

export function purgeBrowseCache() {
  browseCaches = {};
}
