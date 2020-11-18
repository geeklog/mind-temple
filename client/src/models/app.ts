import { createModel, ExtractRematchStateFromModels } from '@rematch/core';
import { Dispatch, RootState } from '../store';
import { BrowseResponse, FileDesc } from './file';
import { RootModel } from './index';
import * as remote from '../services/fileService';
import { between, cmp } from 'mikov';
import { connect } from 'react-redux';
import { defaultAttributes } from '../utils/util';
import { LayoutMode } from './layout';
import eventCenter from '../services/eventCenter';
import { toastError } from '../components/controls/toast';
import { startsWith } from 'mikov/fn/op';

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
  selectIndices: number[];
  sortByName?: string;
  sortByTime?: string;
  sortBySize?: string;
  file: FileDesc;
  path: string;
  error: string;
}

interface History {
  history: string[];
  currIndex: number;
  maxLen: number;
}

interface AppState {
  layout: LayoutMode;
  sidebarOpened: boolean;
  paths: {[path: string]: FolderDesc};
  pathHistory: History;
  currPath: string;
  theme: string;
  showHiddenFiles: boolean;
  fileContextMenu: ContextMenuProps;
  editorLayout: 'edit' | 'preview' | 'both';
  editorSaved: string;
  editorTheme: string;
  editorUnsavedContent: string;
}

const defaultState = {
  layout: 'grid',
  sidebarOpened: true,
  theme: 'light',
  currPath: '~/Downloads/imgs',
  editorLayout: 'both',
  editorSaved: 'saved',
  editorTheme: 'paper',
  editorUnsavedContent: '',
  pathHistory: {
    currIndex: 0,
    history: [],
    maxLen: 5
  },
  paths: {
    '~/Downloads/imgs': {
      path: '~/Downloads/imgs',
      layoutMode: 'grid',
      prevLayoutMode: 'grid',
      currIndex: 0,
      selectIndices: [0],
      sortBy: 'name',
      file: {
        type: 'folder',
        name: 'imgs',
        path: '~/Downloads/imgs',
        ext: '',
        subs: [],
        atime: new Date(),
        ctime: new Date(),
        mtime: new Date(),
        size: 0
      },
      error: ''
    }
  },
  showHiddenFiles: true,
  fileContextMenu: {
    visible: false
  }
} as AppState;

function getSortMethod(folder: FolderDesc) {
  const {sortByName, sortBySize, sortByTime} = folder;
  if (sortByName) {
    return {name: sortByName};
  }
  if (sortBySize) {
    return {size: sortBySize};
  }
  if (sortByTime) {
    return {time: sortByTime};
  }
  return {
    name: 'asc'
  };
}

function getShowingFiles(folder: FolderDesc, showHidden: boolean) {
  let files = folder.file.subs;
  const currSort = getSortMethod(folder);
  if (!files) {
    return [];
  }

  files = showHidden
    ? files
    : files.filter(({name}) => !name.startsWith('.') && !name.startsWith('~$'));

  if (currSort.name) {
    files = files.sort((f1, f2) => {
      return (currSort.name === 'asc' ? 1 : -1) * f1.name.localeCompare(f2.name);
    });
  }
  if (currSort.size) {
    files = files.sort((f1, f2) => {
      return (currSort.size === 'asc' ? 1 : -1) * cmp(f1.size, f2.size);
    });
  }
  if (currSort.time) {
    files = files.sort((f1, f2) => {
      return (currSort.time === 'asc' ? 1 : -1) * cmp(new Date(f1.mtime).getTime(), new Date(f2.mtime).getTime());
    });
  }

  return files;
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
  const oldFolder = state.paths[folder.path];
  state.paths[folder.path] = defaultAttributes(folder, oldFolder, {
    layoutMode: 'grid',
    prevLayoutMode: 'grid',
    currIndex: 0,
    selectIndices: [0],
    sortBy: 'name',
    files: [],
    error: '',
  }) as FolderDesc;
  console.log('updateFolder', state.paths[folder.path]);
  return {...state};
}

function updateCurrFolder(state: AppState, folder: Partial<FolderDesc>) {
  const currPath = folder.path ?? state.currPath;
  if (!currPath) {
    throw new Error('Must have currPath');
  }
  const oldFolder = state.paths[currPath];
  state.currPath = currPath;
  state.paths[currPath] = defaultAttributes(folder, oldFolder, {
    layoutMode: 'grid',
    prevLayoutMode: 'grid',
    currIndex: 0,
    sortByName: 'asc',
    file: null,
    error: ''
  }) as FolderDesc;
  return {...state};
}

function sortFolder(folder: FolderDesc, showHidden: boolean, sortBy: string, order: string): FolderDesc {
  let showingFiles = getShowingFiles(folder, showHidden);
  const currFile = showingFiles[folder.currIndex];
  if (sortBy === 'name') {
    folder.sortByName = order;
    folder.sortBySize = null;
    folder.sortByTime = null;
  } else if (sortBy === 'size') {
    folder.sortByName = null;
    folder.sortBySize = order;
    folder.sortByTime = null;
  } else if (sortBy === 'time') {
    folder.sortByName = null;
    folder.sortBySize = null;
    folder.sortByTime = order;
  }
  showingFiles = getShowingFiles(folder, showHidden);
  folder.currIndex = showingFiles.indexOf(currFile);
  return folder;
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
  state: defaultState,
  reducers: {
    updateFolder,
    updateCurrFolder,
    sortCurrFolder: (
      state: AppState,
      {sortBy, order}: {sortBy: string, order: string}
    ) => {
      const {showHiddenFiles} = state;
      const currFolder = state.paths[state.currPath];
      return updateCurrFolder(state, sortFolder(currFolder, showHiddenFiles, sortBy, order));
    },
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
    toggleSidebar: (state: AppState) => {
      return {
        ...state,
        sidebarOpened: !state.sidebarOpened
      };
    },
    setEditorSaved: (state: AppState, editorSaved: string) => {
      return {
        ...state,
        editorSaved
      };
    },
    setEditorLayout: (state: AppState, editorLayout: 'edit' | 'preview' | 'both') => {
      return {
        ...state,
        editorLayout
      };
    },
    setEditorTheme: (state: AppState, editorTheme: string) => {
      return {
        ...state,
        editorTheme
      };
    },
    setEditorUnsavedContent: (state: AppState, editorUnsavedContent: string) => {
      return {
        ...state,
        editorUnsavedContent,
        editorSaved: 'Save'
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
      const folder = state.paths[state.currPath];
      let {currIndex} = folder;
      const showingFiles = getShowingFiles(folder, state.showHiddenFiles);
      let selectIndices = folder.selectIndices.sort();
      console.log('selectPrev1', currIndex, selectIndices);
      const firstSelectIndex = selectIndices[0];
      currIndex = firstSelectIndex - 1;
      if (!showingFiles.length) {
        currIndex = 0;
      } else if (currIndex < 0) {
        currIndex = showingFiles.length - 1;
      }
      selectIndices = [currIndex];
      return updateCurrFolder(state, {currIndex, selectIndices});
    },
    selectNext: (state: AppState) => {
      const folder = state.paths[state.currPath];
      let {currIndex} = folder;
      const showingFiles = getShowingFiles(folder, state.showHiddenFiles);
      let selectIndices = folder.selectIndices.sort();
      const lastSelectIndex = selectIndices[selectIndices.length - 1];
      currIndex = lastSelectIndex + 1;
      if (!showingFiles.length) {
        return {
          ...state,
          currIndex: 0
        };
      } else if (currIndex >= showingFiles.length) {
        currIndex = 0;
      }
      selectIndices = [currIndex];
      return updateCurrFolder(state, {currIndex, selectIndices});
    },
    selectFile: (state: AppState, targetFilePath: string) => {
      const folder = state.paths[state.currPath];
      const showingFiles = getShowingFiles(folder, state.showHiddenFiles);
      const targetFile = showingFiles.find(f => f.path === targetFilePath);
      const currIndex = showingFiles.indexOf(targetFile);
      const selectIndices = [currIndex];
      return updateCurrFolder(state, {currIndex, selectIndices});
    },
    toggleHiddenFiles: (state: AppState, showHiddenFiles: boolean) => {
      let folder = state.paths[state.currPath];
      let {currIndex} = folder;
      const showingFiles = getShowingFiles(folder, state.showHiddenFiles);
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
          changed.file = res.file;
          if (changed.file && changed.file.type === 'folder') {
            let folder = state.app.paths[currPath];
            folder.file = changed.file;
            const showingFiles = getShowingFiles(folder, showHiddenFiles);
            const currIndex = folder?.currIndex ?? 0;
            changed.currIndex = ensureIndexRange(showingFiles, currIndex);
          }
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
        app.navigateTo(file.path);
      },
      async trash(file: FileDesc, state): Promise<void> {
        await remote.command('trash', file.path);
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
  },
});

const mapAppState = (state: RootState) => {
  const {
    layout,
    paths: folders,
    currPath,
    pathHistory,
    sidebarOpened,
    theme,
    showHiddenFiles,
    fileContextMenu,
    editorLayout,
    editorSaved,
    editorTheme,
    editorUnsavedContent
  } = state.app;

  const currFolder = folders[currPath];

  if (!currFolder?.file) {
    throw new Error('No files in: ' + currPath);
  }

  return ({
    currPath,
    theme,
    showHiddenFiles,
    fileContextMenu,
    sidebarOpened,
    prevLayoutMode: currFolder.prevLayoutMode,
    layoutMode: layout, // currFolder.layoutMode,
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
    getNextAvaliableFileName: (name: string) => {
      let originName = name;
      let i = 0;
      let dupFileName = !!currFolder.file.subs.find(f => f.name === name);
      while (dupFileName) {
        i++;
        name = originName + '_' + i;
        // eslint-disable-next-line no-loop-func
        dupFileName = !!currFolder.file.subs.find(f => f.name === name);
      }
      return name;
    },
    currFile: currFolder,
    files: currFolder.file.subs,
    showingFiles: currFolder.file.type === 'folder'
      ? getShowingFiles(currFolder, showHiddenFiles)
      : null,
    editorLayout,
    editorSaved,
    editorTheme,
    editorUnsavedContent,
  });
};

const mapAppDispatch = (dispatch: Dispatch) => ({
  selectPrev: dispatch.app.selectPrev,
  selectNext: dispatch.app.selectNext,
  setCurrIndex: (currIndex: number) => dispatch.app.updateCurrFolder({currIndex}),
  setLayoutMode: (layoutMode: LayoutMode) => {
    dispatch.app.change({layout: layoutMode});
    // dispatch.app.updateCurrFolder({layoutMode});
  },
  setTheme: (theme: string) => dispatch.app.setTheme(theme),
  toggleSidebar: () => dispatch.app.toggleSidebar(),
  setEditorUnsaved: (saved: string) => dispatch.app.setEditorSaved(saved),
  setEditorLayout: (layout: 'edit' | 'preview' | 'both') => dispatch.app.setEditorLayout(layout),
  setEditorTheme: (theme: string) => dispatch.app.setEditorTheme(theme),
  updateFolder: dispatch.app.updateFolder,
  updateCurrFolder: dispatch.app.updateCurrFolder,
  sortCurrFolder: (sortBy: string, order: string) => {
    dispatch.app.sortCurrFolder({sortBy, order});
  },
  navigateTo: (path?: string) => dispatch.app.navigateTo(path),
  navigateBackward: () => dispatch.app.navigateBackward(),
  navigateForward: () => dispatch.app.navigateForward(),
  open: dispatch.app.open,
  trash: dispatch.app.trash,
  createNewItem: dispatch.app.createNewItem,
  openInServer: dispatch.app.openInServer,
  openFolderInServer: dispatch.app.openFolderInServer,
  gotoColsoleInServer: dispatch.app.gotoColsoleInServer,
  renameFile: dispatch.app.renameFile,
  toggleHiddenFiles: dispatch.app.toggleHiddenFiles,
  toggleFileContextMenu: dispatch.app.toggleFileContextMenu,
  setEditorUnsavedContent: dispatch.app.setEditorUnsavedContent
});

export const connectAppControl = (component: any): any =>
  connect(mapAppState, mapAppDispatch)(component);

type StateProps = ReturnType<typeof mapAppState>;
type DispatchProps = ReturnType<typeof mapAppDispatch>;
export type AppProps = StateProps & DispatchProps;
