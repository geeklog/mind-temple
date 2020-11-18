import fs from 'fs-extra';
import { join } from 'path';

class BrowseCache {
  private paths = {};
  private watcher = null;

  browse(currPath: string) {
    if (this.watcher) {
      this.watcher.close();
    }

    this.watcher = fs.watch(currPath, { recursive: true}, (event, name, ...args) => {
      const changePath = join(currPath, name);
      console.log('BrowseCache', 'watchChanged', event, changePath, ...args);
      this.purge(changePath);
    });

    if (this.paths[currPath]) {
      console.log('BrowseCache', 'getFromCache', currPath);
    }

    return this.paths[currPath];
  }

  purge(path: string) {
    const parts = path.split('/');
    parts.pop();
    const parentPath = parts.join('/');
    console.log('BrowseCache', 'purge', path);
    delete this.paths[path];
    console.log('BrowseCache', 'purge', parentPath);
    delete this.paths[parentPath];
  }
  add(path: string, file: any) {
    console.log('BrowseCache', 'add', path);
    this.paths[path] = file;
  }
}

export default new BrowseCache();
