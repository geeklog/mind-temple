import { createModel } from '@rematch/core';
import { Dispatch, RootState } from '../store';
import { FileDesc } from './file';
import { RootModel } from './index';
import { LayoutMode } from './layout';
import * as remote from '../services/fileService';
import { between } from 'mikov';
import { connect } from 'react-redux';

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

type AppState = {
  layoutMode: string;
  prevLayoutMode: string;
  currIndex: number;
  currPath: string;
  showHiddenFiles: boolean;
  res: BrowseResponse | null;
  files: FileDesc[],
  showingFiles: FileDesc[],
  fileContextMenu: ContextMenuProps
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

export const app = createModel<RootModel>()({
	state: {
    prevLayoutMode: 'grid',
    layoutMode: 'grid',
    currIndex: 0,
    currPath: '~/Downloads/imgs',
    showHiddenFiles: true,
    res: null,
    files: [],
    showingFiles: [],
    fileContextMenu: {
      visible: false
    }
  } as AppState,
	reducers: {
    change: (state: AppState, p: Partial<AppState>) => {
      return {
        ...state,
        ...p
      };
    },
    open: (state: AppState, file: FileDesc) => {
      if (file.type === 'image') {
        return {
          ...state,
          layoutMode: 'gallery',
        }
      }
      if (file.type === 'folder') {
        return {
          ...state,
          currPath: state.currPath + '/' + file.name
        }
      }
      return state;
    },
    openInServer: (state: AppState, file: FileDesc) =>{
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
    setCurrIndex: (state: AppState, currIndex: number) => {
      return {
        ...state,
        currIndex
      };
    },
    setLayoutMode: (state: AppState, layoutMode: LayoutMode) => {
      return {
        ...state,
        prevLayoutMode: state.layoutMode,
        layoutMode
      }
    },
    selectPrev: (state: AppState) => {
      if (!state.showingFiles) {
        return {
          ...state,
          currIndex: 0
        };
      }
      let currIndex = state.currIndex - 1;
      if (currIndex < 0) {
        currIndex = state.showingFiles.length - 1;
      }
      return {
        ...state,
        currIndex
      }
    },
    selectNext: (state: AppState) => {
      if (!state.showingFiles) {
        return {
          ...state,
          currIndex: 0
        };
      }
      let currIndex = state.currIndex + 1;
      if (currIndex >= state.showingFiles.length) {
        currIndex = 0;
      }
      return {
        ...state,
        currIndex
      };
    },
    setCurrPath: (state: AppState, currPath: string) => {
      return {
        ...state,
        currPath
      }
    },
    toggleHiddenFiles: (state: AppState, showHiddenFiles: boolean) => {
      const {files, currIndex} = state;
      const showingFiles = filterHiddenFiles(files, showHiddenFiles);
      const index = ensureIndexRange(showingFiles, currIndex);
      return {
        ...state,
        showHiddenFiles,
        showingFiles,
        currIndex: index
      };
    },
    toggleFileContextMenu: (
      state: AppState,
      {visible, x, y, file}: {visible: boolean, x?: number, y?: number, file?: FileDesc}) =>
    {
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
		const { app } = dispatch
		return {
      async browse(payload, state): Promise<void> {
        const {currPath, currIndex, showHiddenFiles} = state.app;
        const res = await remote.browse(currPath);
        const changed: Partial<AppState> = {res};
        if (res.ok) {
          changed.files = res.files;
          changed.showingFiles = filterHiddenFiles(changed.files, showHiddenFiles);
          changed.currIndex = ensureIndexRange(changed.showingFiles, currIndex);
        }
        app.change(changed);
      },
      async trash(file: FileDesc, state): Promise<void> {
        await remote.command('trash', file.path);
        app.browse();
      }
		}
	},
});

const mapAppState = (state: RootState) => ({
  prevLayoutMode: state.app.prevLayoutMode,
  layoutMode: state.app.layoutMode,
  currIndex: state.app.currIndex,
  currPath: state.app.currPath,
  showHiddenFiles: state.app.showHiddenFiles,
  res: state.app.res,
  files: state.app.files,
  showingFiles: state.app.showingFiles,
  fileContextMenu: state.app.fileContextMenu
});

const mapAppDispatch = (dispatch: Dispatch) => ({
  selectPrev: dispatch.app.selectPrev,
  selectNext: dispatch.app.selectNext,
  setCurrIndex: dispatch.app.setCurrIndex,
  setLayoutMode: dispatch.app.setLayoutMode,
  setCurrPath: dispatch.app.setCurrPath,
  browse: dispatch.app.browse,
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

type StateProps = ReturnType<typeof mapAppState>
type DispatchProps = ReturnType<typeof mapAppDispatch>
export type AppProps = StateProps & DispatchProps
