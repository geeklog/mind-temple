import { createModel, ExtractRematchStateFromModels } from '@rematch/core';
import { Dispatch, RootState } from '../store';
import { FileDesc } from './file';
import { RootModel } from './index';
import * as remote from '../services/fileService';
import { between } from 'mikov';
import { connect } from 'react-redux';
import { defaultAttributes } from '../utils/util';

interface BrowseResponse {
  ok: 0 | 1;
  message?: string;
  files: FileDesc[];
}

export interface ContextMenuProps {
  file?: FileDesc;
  visible: boolean;
  x?: number;
  y?: number;
}

interface FolderDesc {
  layoutMode: string;
  prevLayoutMode: string;
  currIndex: number;
  sortByName?: string;
  sortByTime?: string;
  sortBySize?: string;
  files: FileDesc[];
  path: string;
  error: string;
}

interface History {
  history: string[];
  currIndex: number;
  maxLen: number;
}

interface AppState {
  folders: {[path: string]: FolderDesc};
  pathHistory: History;
  currPath: string;
  theme: string;
  showHiddenFiles: boolean;
  fileContextMenu: ContextMenuProps;
}

function filterHiddenFiles(files: FileDesc[], showHidden: boolean) {
  if (showHidden) {
    return files;
  } else {
    return files.filter(({name}) => !name.startsWith('.') && !name.startsWith('~$'));
  }
}

function ensureIndexRange(files: FileDesc[], index: number) {
  if (files.length > 0) {
    return between(0, index, files.length - 1);
  } else {
    return 0;
  }
}

function updateFolder(state: AppState, folder: Partial<FolderDesc>) {
  if (!folder.path) {
    throw new Error('Must have folder.path');
  }
  const oldFolder = state.folders[folder.path];
  state.folders[folder.path] = defaultAttributes(folder, oldFolder, {
    layoutMode: 'grid',
    prevLayoutMode: 'grid',
    currIndex: 0,
    sortBy: 'name',
    files: [],
    error: ''
  }) as FolderDesc;
  return {...state};
}

function updateCurrFolder(state: AppState, folder: Partial<FolderDesc>) {
  const currPath = folder.path ?? state.currPath;
  if (!currPath) {
    throw new Error('Must have currPath');
  }
  const oldFolder = state.folders[currPath];
  state.currPath = currPath;
  state.folders[currPath] = defaultAttributes(folder, oldFolder, {
    layoutMode: 'grid',
    prevLayoutMode: 'grid',
    currIndex: 0,
    sortByName: 'asc',
    files: [],
    error: ''
  }) as FolderDesc;
  return {...state};
}

function navigateBackward({history, currIndex, maxLen}: History): History {
  currIndex = between(0, currIndex - 1, history.length - 1);
  return {
    currIndex,
    history,
    maxLen
  };
}

function navigateForward({history, currIndex, maxLen}: History): History {
  currIndex = between(0, currIndex + 1, history.length - 1);
  return {
    currIndex,
    history,
    maxLen
  };
}

function pushHistory({history, currIndex, maxLen}: History, path: string): History {
  history = history.slice(0, currIndex + 1);
  history.push(path);
  if (history.length > maxLen) {
    history.shift();
  }
  const historyObj = {
    currIndex: history.length - 1,
    history,
    maxLen
  };
  return historyObj;
}

export const app = createModel<RootModel>()({
  state: {
    theme: 'light',
    currPath: '~/Downloads/imgs',
    pathHistory: {
      currIndex: 0,
      history: [],
      maxLen: 5
    },
    folders: {
      '~/Downloads/imgs': {
        path: '~/Downloads/imgs',
        layoutMode: 'grid',
        prevLayoutMode: 'grid',
        currIndex: 0,
        sortBy: 'name',
        files: [],
        error: ''
      }
    },
    showHiddenFiles: true,
    fileContextMenu: {
      visible: false
    }
  } as AppState,
  reducers: {
    updateFolder,
    updateCurrFolder,
    change: (state: AppState, changed: Partial<AppState>) => {
      return {
        ...state,
        ...changed
      };
    },
    setTheme: (state: AppState, theme: string) => {
      return {
        ...state,
        theme
      };
    },
    openInServer: (state: AppState, file: FileDesc) => {
      remote.command('open', file.path);
      return state;
    },
    openFolderInServer: (state: AppState, file: FileDesc) => {
      remote.command('open-folder', file.path);
      return state;
    },
    gotoColsoleInServer: (state: AppState, file: FileDesc) => {
      remote.command('open-console', file.path);
      return state;
    },
    selectPrev: (state: AppState) => {
      const folder = state.folders[state.currPath];
      let {currIndex, files} = folder;
      const showingFiles = filterHiddenFiles(files, state.showHiddenFiles);
      currIndex = currIndex - 1;
      if (!showingFiles.length) {
        currIndex = 0;
      } else if (currIndex < 0) {
        currIndex = showingFiles.length - 1;
      }
      return updateCurrFolder(state, {currIndex});
    },
    selectNext: (state: AppState) => {
      const folder = state.folders[state.currPath];
      let {currIndex, files} = folder;
      const showingFiles = filterHiddenFiles(files, state.showHiddenFiles);
      currIndex = currIndex + 1;
      if (!showingFiles.length) {
        return {
          ...state,
          currIndex: 0
        };
      } else if (currIndex >= showingFiles.length) {
        currIndex = 0;
      }
      return updateCurrFolder(state, {currIndex});
    },
    toggleHiddenFiles: (state: AppState, showHiddenFiles: boolean) => {
      let {files, currIndex} = state.folders[state.currPath];
      const showingFiles = filterHiddenFiles(files, showHiddenFiles);
      currIndex = ensureIndexRange(showingFiles, currIndex);
      return {
        ...updateCurrFolder(state, { currIndex }),
        showHiddenFiles
      };
    },
    toggleFileContextMenu: (
      state: AppState,
      {visible, x, y, file}: {visible: boolean, x?: number, y?: number, file?: FileDesc}) => {
      if (!state.fileContextMenu.visible && !visible) {
        return state;
      }
      return {
        ...state,
        fileContextMenu: {
          ...state.fileContextMenu,
          visible,
          x,
          y,
          file
        }
      };
    }
  },
  effects: (dispatch: Dispatch) => {
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
        changed.path = currPath;
        if (res.ok) {
          changed.files = res.files;
          const showingFiles = filterHiddenFiles(changed.files, showHiddenFiles);
          const currIndex = state.app.folders[currPath]?.currIndex ?? 0;
          changed.currIndex = ensureIndexRange(showingFiles, currIndex);
        } else {
          changed.error = res.message;
        }
        app.updateCurrFolder(changed);
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
        if (file.type === 'folder') {
          app.navigateTo(file.path);
        } else {
          app.updateCurrFolder({ layoutMode: 'gallery' });
        }
      },
      async trash(file: FileDesc, state): Promise<void> {
        await remote.command('trash', file.path);
        app.browse(null);
      }
    };
  },
});

const mapAppState = (state: RootState) => {
  const {
    folders,
    currPath,
    pathHistory,
    theme,
    showHiddenFiles,
    fileContextMenu
  } = state.app;

  const currFolder = folders[currPath];

  if (!currFolder?.files) {
    throw new Error('No files in: ' + currPath);
  }

  return ({
    currPath,
    theme,
    showHiddenFiles,
    fileContextMenu,
    prevLayoutMode: currFolder.prevLayoutMode,
    layoutMode: currFolder.layoutMode,
    currIndex: currFolder.currIndex,
    currSort: (() => {
      const {sortByName, sortBySize, sortByTime} = currFolder;
      if (sortByName) {
        return {name: sortByName};
      }
      if (sortBySize) {
        return {size: sortBySize};
      }
      if (sortByTime) {
        return {time: sortByTime};
      }
    })(),
    canNavigateForward: pathHistory.currIndex < pathHistory.history.length - 1,
    canNavigateBackward: pathHistory.currIndex > 0,
    currError: currFolder.error,
    getFolder: (path: string) => folders[path],
    files: currFolder.files,
    showingFiles: filterHiddenFiles(currFolder.files, showHiddenFiles),
  });
};

const mapAppDispatch = (dispatch: Dispatch) => ({
  selectPrev: dispatch.app.selectPrev,
  selectNext: dispatch.app.selectNext,
  setCurrIndex: (currIndex: number) => dispatch.app.updateCurrFolder({currIndex}),
  setLayoutMode: (layoutMode: string) => dispatch.app.updateCurrFolder({layoutMode}),
  setTheme: (theme: string) => dispatch.app.setTheme(theme),
  updateFolder: dispatch.app.updateFolder,
  updateCurrFolder: dispatch.app.updateCurrFolder,
  sortCurrFolder: (sortBy: string, order: string) => {
    if (sortBy === 'name') {
      dispatch.app.updateCurrFolder({
        sortByName: order,
        sortBySize: null,
        sortByTime: null
      });
    } else if (sortBy === 'size') {
      dispatch.app.updateCurrFolder({
        sortByName: null,
        sortBySize: order,
        sortByTime: null
      });
    } else if (sortBy === 'time') {
      dispatch.app.updateCurrFolder({
        sortByName: null,
        sortBySize: null,
        sortByTime: order
      });
    }
  },
  navigateTo: (path?: string) => dispatch.app.navigateTo(path),
  navigateBackward: () => dispatch.app.navigateBackward(),
  navigateForward: () => dispatch.app.navigateForward(),
  open: dispatch.app.open,
  trash: dispatch.app.trash,
  openInServer: dispatch.app.openInServer,
  openFolderInServer: dispatch.app.openFolderInServer,
  gotoColsoleInServer: dispatch.app.gotoColsoleInServer,
  toggleHiddenFiles: dispatch.app.toggleHiddenFiles,
  toggleFileContextMenu: dispatch.app.toggleFileContextMenu,
});

export const connectAppControl = (component: any): any =>
  connect(mapAppState, mapAppDispatch)(component);

type StateProps = ReturnType<typeof mapAppState>;
type DispatchProps = ReturnType<typeof mapAppDispatch>;
export type AppProps = StateProps & DispatchProps;
