import React from 'react';
import './styles/App.scss';
import { FileDesc } from './models/file';
import FilePreviewGridLayout from './components/FilePreviewGridLayout';
import FilePreviewListLayout from './components/FilePreviewListLayout';
import FilePreviewGalleryLayout from './components/FilePreviewGalleryLayout';
import { LayoutMode } from './models/layout';
import TopMenubar from './components/TopMenubar';
import * as remote from './services/fileService';
import FileContextMenu, { ContextMenuProps } from './components/FileContextMenu';

interface BrowseResponse {
  ok: 0 | 1;
  message?: string;
  files: FileDesc[];
}

interface State {
  layoutMode: LayoutMode;
  prevLayoutMode: LayoutMode;
  currIndex: number;
  folderPath: string;
  showHiddenFiles: boolean;
  res: BrowseResponse|null;
  fileContextMenu: ContextMenuProps
}

export interface AppControl {
  open: (file: FileDesc) => void;
  openInServer: (file: FileDesc) => void;
  openFolderInServer: (file: FileDesc) => void;
  gotoColsoleInServer: (file: FileDesc) => void;
  trash: (file: FileDesc) => Promise<void>;
  setCurrIndex: (currIndex: number) => void
  setLayoutMode: (layoutMode: LayoutMode) => void;
  selectPrev: () => void;
  selectNext: () => void;
  setFolderPath: (path: string) => void;
  toggleHiddenFiles: (showHidden: boolean) => void;
  toggleFileContextMenu: (show: boolean, x?: number, y?: number, file?: FileDesc) => void;
}

export default class App extends React.Component<any, State> {

  browse = async () => {
    const {folderPath} = this.state;
    const res = await remote.browse(folderPath);
    this.setState({res});
  }

  open = (file: FileDesc) => {
    if (file.type === 'image') {
      this.setState({
        layoutMode: 'gallery',
      });
      return;
    }
    if (file.type === 'folder') {
      this.setState({
        folderPath: this.state.folderPath + '/' + file.name
      })
    }
  }

  openInServer = (file: FileDesc) => {
    remote.command('open', file.path);
  }

  openFolderInServer = (file: FileDesc) => {
    remote.command('open-folder', file.path);
  }

  gotoColsoleInServer = (file: FileDesc) => {
    remote.command('open-console', file.path);
  }

  trash = async (file: FileDesc) => {
    await remote.command('trash', file.path);
    this.browse();
  }

  setCurrIndex = (currIndex: number) => {
    this.setState({ currIndex });
  }

  setLayoutMode = (layoutMode: LayoutMode) => {
    this.setState({ prevLayoutMode: this.state.layoutMode });
    this.setState({ layoutMode });
  }

  setFolderPath = (folderPath: string) => {
    this.setState({ folderPath });
  }

  selectPrev = () => {
    if (!this.state.res) {
      return;
    }
    let currIndex = this.state.currIndex - 1;
    if (currIndex < 0) {
      currIndex = this.state.res.files.length - 1;
    }
    this.setState({currIndex});
  };

  selectNext = () => {
    if (!this.state.res) {
      return;
    }
    let currIndex = this.state.currIndex + 1;
    if (currIndex >= this.state.res.files.length) {
      currIndex = 0;
    }
    this.setState({ currIndex });
  };

  toggleHiddenFiles = (showHiddenFiles: boolean) => {
    this.setState({
      showHiddenFiles
    });
  }

  toggleFileContextMenu = (visible: boolean, x?: number, y?: number, file?: FileDesc) => {
    this.setState({
      fileContextMenu: {
        ...this.state.fileContextMenu,
        visible,
        x,
        y,
        file
      }
    });
  }

  onKeyDown = (event: KeyboardEvent) => {
    const {layoutMode} = this.state;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.selectPrev();
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.selectNext();
      return;
    }
    if (event.key === ' ') {
      event.preventDefault();
      if (layoutMode !== 'gallery') {
        this.setLayoutMode('gallery');
      } else {
        this.setLayoutMode(this.state.prevLayoutMode);
      }
    }
  }

  control: AppControl = {
    open: this.open,
    openInServer: this.openInServer,
    setCurrIndex: this.setCurrIndex,
    setLayoutMode: this.setLayoutMode,
    selectPrev: this.selectPrev,
    selectNext: this.selectNext,
    setFolderPath: this.setFolderPath,
    toggleHiddenFiles: this.toggleHiddenFiles,
    toggleFileContextMenu: this.toggleFileContextMenu,
    openFolderInServer: this.openFolderInServer,
    gotoColsoleInServer: this.gotoColsoleInServer,
    trash: this.trash
  }

  state: State = {
    prevLayoutMode: 'grid',
    layoutMode: 'grid',
    currIndex: 0,
    folderPath: '~/Downloads/imgs',
    showHiddenFiles: false,
    res: null,
    fileContextMenu: {
      visible: false,
      control: this.control
    }
  };

  componentDidMount() {
    this.browse();
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  componentDidUpdate(prevProps: any, prevState: State) {
    if (prevState.folderPath !== this.state.folderPath) {
      this.browse();
    }
  }

  render() {
    const {folderPath, fileContextMenu} = this.state;
    return (
      <div className="main">
        <TopMenubar
          folderPath={folderPath}
          showHiddenFiles={this.state.showHiddenFiles}
          control={this.control}
        />
        {this.renderMain()}
        <FileContextMenu {...fileContextMenu} />
      </div>
    );
  }

  renderMain() {
    const {res, layoutMode, showHiddenFiles} = this.state;
    if (!res) {
      return;
    }
    if (!res.ok) {
      return (
        <div className="error-msg">
          {res.message}
        </div>
      )
    }
    const files = showHiddenFiles
      ? res.files
      : res.files.filter(({name}) => !name.startsWith('.'));
    
    return (
      <>
        {layoutMode === 'grid' && this.renderGrid(files)}
        {layoutMode === 'list' && this.renderList(files)}
        {layoutMode === 'gallery' && this.renderGallery(files)}
      </>
    );
  }

  renderGrid(files: FileDesc[]) {
    const {currIndex} = this.state;
    return (
      <FilePreviewGridLayout
        currSelected={currIndex}
        control={this.control}
        files={files}
      />
    );
  }

  renderList(files: FileDesc[]) {
    const {currIndex} = this.state;
    return (
      <FilePreviewListLayout
        files={files}
        currSelected={currIndex}
        control={this.control}
      />
    );
  }

  renderGallery(files: FileDesc[]) {
    const {currIndex} = this.state;
    return (
      <FilePreviewGalleryLayout
        files={files}
        currIndex={currIndex}
        control={this.control}
      />
    )
  }
  
}