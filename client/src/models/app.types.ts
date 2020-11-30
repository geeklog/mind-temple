import { FileDesc } from "./file";
import { LayoutMode } from "./layout";

export interface ContextMenuProps {
  file?: FileDesc;
  visible: boolean;
  x?: number;
  y?: number;
}

export interface FolderDesc {
  layoutMode: string;
  prevLayoutMode: string;
  currIndex: number | null;
  selectIndices: number[];
  sortByName?: string;
  sortByTime?: string;
  sortBySize?: string;
  file: FileDesc;
  path: string;
  error: string;
}

export interface History {
  history: string[];
  currIndex: number;
  maxLen: number;
}

export interface AppState {
  layout: LayoutMode;
  topbarOpened: boolean;
  sidebarOpened: boolean;
  rightPaneOpened: boolean;
  paths: {[path: string]: FolderDesc};
  pathHistory: History;
  currPath: string;
  theme: string;
  error: string;
  showHiddenFiles: boolean;
  fileContextMenu: ContextMenuProps;
  editorLayout: 'edit' | 'preview' | 'both';
  editorSaved: string;
  editorTheme: string;
  editorUnsavedContent: string;
}
