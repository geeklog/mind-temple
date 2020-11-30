import { between, cmp } from 'mikov';
import { AppState, FolderDesc, History } from './app.types';
import { FileDesc } from './file';
import natsort from 'natsort';
import { defaultAttributes } from '../utils/util';

const nartualSortAsc = natsort();
const nartualSortDsc = natsort({desc: true});

export function getSortMethod(folder: FolderDesc) {
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

export function getShowingFiles(folder: FolderDesc, showHidden: boolean) {
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
      if (f1.type === 'folder' && f2.type !== 'folder') {
        return -1;
      }
      if (f1.type !== 'folder' && f2.type === 'folder') {
        return 1;
      }
      return (
        currSort.name === 'asc' ? nartualSortAsc : nartualSortDsc
      )(f1.name, f2.name);
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

export function ensureIndexRange(files: FileDesc[], index: number) {
  if (files.length > 0) {
    return between(0, index, files.length - 1);
  } else {
    return 0;
  }
}

export function sortFolder(folder: FolderDesc, showHidden: boolean, sortBy: string, order: string): FolderDesc {
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

export function navigateBackward({history, currIndex, maxLen}: History): History {
  currIndex = between(0, currIndex - 1, history.length - 1);
  return {
    currIndex,
    history,
    maxLen
  };
}

export function navigateForward({history, currIndex, maxLen}: History): History {
  currIndex = between(0, currIndex + 1, history.length - 1);
  return {
    currIndex,
    history,
    maxLen
  };
}

export function pushHistory({history, currIndex, maxLen}: History, path: string): History {
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

export function updateFolder(state: AppState, folder: Partial<FolderDesc>) {
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
  return {...state};
}

export function updateCurrFolder(state: AppState, folder: Partial<FolderDesc>) {
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
