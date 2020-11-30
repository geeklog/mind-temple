import { ExtractRematchStateFromModels } from '@rematch/core';
import { Dispatch } from '../store';
import { BrowseResponse, FileDesc } from './file';
import { RootModel } from './index';
import * as remote from '../services/fileService';
import eventCenter from '../services/eventCenter';
import { toastError } from '../components/controls/toast';
import { startsWith } from 'mikov/fn/op';
import { FolderDesc } from './app.types';
import { ensureIndexRange, getShowingFiles, navigateBackward, navigateForward, pushHistory, updateFolder } from './app.utils';

const effects = (dispatch: Dispatch) => {
  const { app } = dispatch;
  return {
    async browse(currPath: string, state: ExtractRematchStateFromModels<RootModel>): Promise<void> {
      if (currPath === state.app.currPath) {
        return;
      }
      currPath = currPath || state.app.currPath;
      const showHiddenFiles = state.app.showHiddenFiles;
      app.change({
        ...updateFolder(state.app, {path: currPath}),
      });
      console.log('browse---1', currPath);
      const res: BrowseResponse = await remote.browse(currPath);
      console.log('browse---2', currPath);
      const changed: Partial<FolderDesc> = {};
      if (res.ok) {
        changed.path = currPath;
        changed.file = res.file;
        if (changed.file && changed.file.type === 'folder') {
          let folder = state.app.paths[currPath];
          folder.file = changed.file;
          const showingFiles = getShowingFiles(folder, showHiddenFiles);
          const currIndex = folder?.currIndex ?? 0;
          changed.currIndex = ensureIndexRange(showingFiles, currIndex);
        }
        app.change({error: res.error});
        app.updateCurrFolder(changed);
      } else {
        app.change({error: res.error});
      }
    },
    async navigateTo(path: string, state: ExtractRematchStateFromModels<RootModel>) {
      if (path === state.app.currPath) {
        return;
      }
      if (path) {
        app.change({
          ...state.app,
          pathHistory: {
            ...pushHistory(state.app.pathHistory, path)
          }
        });
      }
      app.browse(path);
    },
    async navigateBackward(payload: any, state: ExtractRematchStateFromModels<RootModel>) {
      const pathHistory = navigateBackward(state.app.pathHistory);
      app.change({
        ...state.app,
        pathHistory: { ...pathHistory }
      });
      app.browse(pathHistory.history[pathHistory.currIndex]);
    },
    async navigateForward(payload: any, state: ExtractRematchStateFromModels<RootModel>) {
      const pathHistory = navigateForward(state.app.pathHistory);
      app.change({
        ...state.app,
        pathHistory: { ...pathHistory }
      });
      app.browse(pathHistory.history[pathHistory.currIndex]);
    },
    open(file: FileDesc, state) {
      // console.log('open', file);
      app.navigateTo(file.path);
    },
    async trash(files: FileDesc[], state): Promise<void> {
      const res = await remote.trash(files.map(f => f.path));
      if (!res.ok) {
        toastError(res.error);
        return;
      }
      for (const {ok, path, error} of res.executes) {
        if (!ok) {
          toastError(`Error try to delete file: ${path} ${error}`);
        }
      }
      app.selectIndex(null);
      app.browse(null);
    },
    async renameFile({filePath, newName}: {filePath: string, newName: string}, state): Promise<void> {
      const r = await remote.rename(filePath, newName);
      if (r.ok) {
        app.browse(null);
      } else {
        if (startsWith(['EISDIR', 'ENOTDIR', 'ENOTEMPTY'])(r.error)) {
          toastError('Name duplicated!');
        } else {
          toastError(r.error);
        }
        eventCenter.dispatchEvent('Cmd:RenameFile', filePath);
      }
    },
    async moveFiles({files, targetPath}: {files: FileDesc[], targetPath: string}): Promise<void> {
      const r = await remote.moveFiles(files, targetPath);
      if (r.ok) {
        app.browse(null);
      }
      if (r.error.length) {
        for (const err of r.error) {
          toastError(err);
        }
      }
    },
    async createNewItem(
      {filePath, newName, type}: {filePath: string, newName: string, type: string},
      state: ExtractRematchStateFromModels<RootModel>
    ): Promise<void> {
      const newFile = await remote.create(filePath, newName, type);
      await app.browse(null);
      if (!newFile) {
        return;
      }
      app.selectFile(newFile);
      eventCenter.dispatchEvent('Cmd:RenameFile', newFile);
    },
  };
};

export default effects;
