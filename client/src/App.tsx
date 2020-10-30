import React from 'react';
import './styles/App.css';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { apiServer } from './config';
import { FileDesc } from './models/file';
import FilePreviewGridLayout from './components/FilePreviewGridLayout';
import FilePreviewListLayout from './components/FilePreviewListLayout';
import FilePreviewGalleryLayout from './components/FilePreviewGalleryLayout';
import { LayoutMode } from './models/layout';
import TopMenubar from './components/TopMenubar';

interface BrowseResponse {
  ok: 0 | 1;
  message?: string;
  files: FileDesc[];
}

interface State {
  layoutMode: LayoutMode,
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
    layoutMode: 'grid',
    currIndex: 0,
    folderPath: '~/Downloads/imgs',
    res: null
  };

  callAPI = () => {
    const {folderPath} = this.state;
    fetch(`${apiServer}/browse/${folderPath}`)
      .then(res => res.json())
      .then(r => this.setState({res: r}))
      .catch(err => err);
  }

  open = (currIndex: number, file: FileDesc) => {
    this.setState({
      layoutMode: 'gallery',
      currIndex
    });
  }

  setCurrIndex = (currIndex: number) => {
    this.setState({ currIndex });
  }

  setLayoutMode = (layoutMode: LayoutMode) => {
    this.setState({ layoutMode });
  }

  setFolderPath = (folderPath: string) => {
    this.setState({ folderPath });
  }

  selectPrev = () => {
    if (!this.state.res) {
      return;
    }
    this.setState({currIndex: Math.max(this.state.currIndex - 1, 0)})
  };

  selectNext = () => {
    if (!this.state.res) {
      return;
    }
    this.setState({
      currIndex: Math.min(this.state.currIndex + 1, this.state.res.files.length - 1)
    })
  };

  onKeyUp = (event: KeyboardEvent) => {
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
    console.log('componentDidMount');
    this.callAPI();
    document.addEventListener('keyup', this.onKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.onKeyUp);
  }

  componentDidUpdate(prevProps: any, prevState: State) {
    if (prevState.folderPath !== this.state.folderPath) {
      this.callAPI();
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
        {res?.ok && layoutMode === 'grid' && this.renderGrid(res.files) }
        {res?.ok && layoutMode === 'list' && this.renderList(res.files) }
        {res?.ok && layoutMode === 'gallery' && this.renderGallery(res.files) }
        {res && !res.ok &&
          <div className="error-msg">
            {res.message}
          </div>
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