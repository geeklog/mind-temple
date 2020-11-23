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
      this.purge(changePath);
    });

    return this.paths[currPath];
  }

  purge(path: string) {
    const parts = path.split('/');
    parts.pop();
    const parentPath = parts.join('/');
    delete this.paths[path];
    delete this.paths[parentPath];
  }
  add(path: string, file: any) {
    this.paths[path] = file;
  }
}

export default new BrowseCache();
