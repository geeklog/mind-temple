import { createModel } from '@rematch/core';
import { RootModel } from './index';
import { AppState } from './app.types';
import effects from './app.effects';
import reducers from './app.reducers';
import { mapAppDispatch, mapAppState } from './app.connects';
import { connect } from 'react-redux';

const defaultState = {
  layout: 'grid',
  topbarOpened: true,
  sidebarOpened: true,
  rightPaneOpened: true,
  theme: 'light',
  error: '',
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
  favorites: [],
  showHiddenFiles: true,
  fileContextMenu: {
    visible: false
  }
} as AppState;

export const app = createModel<RootModel>()({
  state: defaultState,
  reducers,
  effects,
});

type StateProps = ReturnType<typeof mapAppState>;
type DispatchProps = ReturnType<typeof mapAppDispatch>;
export type AppProps = StateProps & DispatchProps;

export const connectAppControl = (component: any): any => connect(mapAppState, mapAppDispatch)(component);
