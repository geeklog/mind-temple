import * as remote from '../services/fileService';
import { range } from '../utils/util';
import { AppState } from './app.types';
import { updateFolder, updateCurrFolder, sortFolder, getShowingFiles, ensureIndexRange } from './app.utils';
import { FileDesc } from './file';

const reducers = {
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
  toggleTopbar: (state: AppState) => {
    console.log('toggleTopbar:', !state.topbarOpened);
    return {
      ...state,
      topbarOpened: !state.topbarOpened
    };
  },
  toggleSidebar: (state: AppState) => {
    return {
      ...state,
      sidebarOpened: !state.sidebarOpened
    };
  },
  toggleRightPane: (state: AppState) => {
    return {
      ...state,
      rightPaneOpened: !state.rightPaneOpened
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
  selectIndex: (state: AppState, currIndex: number | null) => {
    const selectIndices = currIndex === null ? [] : [currIndex];
    return updateCurrFolder(state, {currIndex, selectIndices});
  },
  selectPrev: (state: AppState) => {
    const folder = state.paths[state.currPath];
    let {currIndex} = folder;
    const showingFiles = getShowingFiles(folder, state.showHiddenFiles);
    let selectIndices = folder.selectIndices.sort();
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
  toggleSelectIndex: (state: AppState, index: number) => {
    const folder = state.paths[state.currPath];
    let {currIndex, selectIndices} = folder;
    if (selectIndices.indexOf(index) >= 0) {
      selectIndices.splice(selectIndices.indexOf(index), 1);
      selectIndices = [...selectIndices];
    } else {
      selectIndices = [...selectIndices, index];
    }
    return updateCurrFolder(state, {currIndex, selectIndices});
  },
  selectIndicesBetween: (
    state: AppState,
    {startIndex, endIndex}: {startIndex: number, endIndex: number}
  ) => {
    const selectIndices = range(startIndex, endIndex);
    return updateCurrFolder(state, {currIndex: selectIndices[0], selectIndices});
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
};

export default reducers;
