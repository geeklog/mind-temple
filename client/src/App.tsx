import React from 'react';
import './styles/App.scss';
import { FileDesc } from './models/file';
import FilePreviewGridLayout from './components/FilePreviewGridLayout';
import FilePreviewListLayout from './components/FilePreviewListLayout';
import FilePreviewGalleryLayout from './components/FilePreviewGalleryLayout';
import { LayoutMode } from './models/layout';
import TopMenubar from './components/TopMenubar';
import { browse } from './services/fileService';

interface BrowseResponse {
  ok: 0 | 1;
  message?: string;
  files: FileDesc[];
}

interface State {
  layoutMode: LayoutMode,
  prevLayoutMode: LayoutMode,
  currIndex: number,
  folderPath: string,
  res: BrowseResponse|null
}

export interface AppControl {
  open: (currIndex: number, file: FileDesc) => void;
  setCurrIndex: (currIndex: number) => void
  setLayoutMode: (layoutMode: LayoutMode) => void;
  selectPrev: () => void;
  selectNext: () => void;
  setFolderPath: (path: string) => void;
}

export default class App extends React.Component {

  state: State = {
    prevLayoutMode: 'grid',
    layoutMode: 'grid',
    currIndex: 0,
    folderPath: '~/Downloads/imgs',
    res: null
  };

  browse = async () => {
    const {folderPath} = this.state;
    const res = await browse(folderPath);
    this.setState({res});
  }

  open = (currIndex: number, file: FileDesc) => {
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
    setCurrIndex: this.setCurrIndex,
    setLayoutMode: this.setLayoutMode,
    selectPrev: this.selectPrev,
    selectNext: this.selectNext,
    setFolderPath: this.setFolderPath
  }

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
    const {folderPath, res, layoutMode} = this.state;
  
    return (
      <div className="main">
        <TopMenubar
          folderPath={folderPath}
          control={this.control}
        />
        {res?.ok && layoutMode === 'grid' && this.renderGrid(res.files) || undefined}
        {res?.ok && layoutMode === 'list' && this.renderList(res.files) || undefined}
        {res?.ok && layoutMode === 'gallery' && this.renderGallery(res.files) || undefined}
        {res && !res.ok &&
          <div className="error-msg">
            {res.message}
          </div> || undefined
        }
      </div>
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