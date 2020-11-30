import { Dispatch, RootState } from '../store';
import { LayoutMode } from './layout';
import { getShowingFiles } from './app.utils';

export const mapAppState = (state: RootState) => {
  const {
    layout,
    paths: folders,
    currPath,
    error,
    pathHistory,
    topbarOpened,
    sidebarOpened,
    rightPaneOpened,
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
    topbarOpened,
    sidebarOpened,
    rightPaneOpened,
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
    currError: error,
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
    selectedFiles: (() => {
      const {selectIndices} = currFolder;
      const showingFiles = currFolder.file.type === 'folder'
        ? getShowingFiles(currFolder, showHiddenFiles)
        : null;
      if (!showingFiles) {
        return null;
      }
      return selectIndices.map(i => showingFiles[i]);
    })(),
    editorLayout,
    editorSaved,
    editorTheme,
    editorUnsavedContent,
  });
};

export const mapAppDispatch = (dispatch: Dispatch) => ({
  selectPrev: dispatch.app.selectPrev,
  selectNext: dispatch.app.selectNext,
  setCurrIndex: (index: number) => dispatch.app.selectIndex(index),
  toggleSelectIndex: (index: number) => dispatch.app.toggleSelectIndex(index),
  selectIndicesBetween: (startIndex: number, endIndex: number) => dispatch.app.selectIndicesBetween({startIndex, endIndex}),
  setLayoutMode: (layoutMode: LayoutMode) => {
    dispatch.app.change({layout: layoutMode});
  },
  setTheme: (theme: string) => dispatch.app.setTheme(theme),
  toggleTopbar: dispatch.app.toggleTopbar,
  toggleSidebar: dispatch.app.toggleSidebar,
  toggleRightPane: dispatch.app.toggleRightPane,
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
  moveFiles: dispatch.app.moveFiles,
  toggleHiddenFiles: dispatch.app.toggleHiddenFiles,
  toggleFileContextMenu: dispatch.app.toggleFileContextMenu,
  setEditorUnsavedContent: dispatch.app.setEditorUnsavedContent
});
