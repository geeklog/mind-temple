import React from 'react';
import './styles/App.scss';
import { FileDesc } from './models/file';
import FilePreviewGridLayout from './components/FilePreviewGridLayout';
import FilePreviewListLayout from './components/FilePreviewListLayout';
import FilePreviewGalleryLayout from './components/FilePreviewGalleryLayout';
import TopMenubar from './components/TopMenubar';
import FileContextMenu from './components/FileContextMenu';
import { watchPropORStateChanges } from './debug';
import { AppProps, connectAppControl } from './models/app';
import { LayoutMode } from './models/layout';

class App extends React.PureComponent<AppProps> {

  onKeyDown = (event: KeyboardEvent) => {
    const {
      prevLayoutMode,
      layoutMode,
      selectPrev,
      selectNext,
      setLayoutMode
    } = this.props;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      selectPrev();
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      selectNext();
      return;
    }
    if (event.key === ' ') {
      event.preventDefault();
      if (layoutMode !== 'gallery') {
        setLayoutMode('gallery');
      } else {
        setLayoutMode(prevLayoutMode as LayoutMode);
      }
    }
  }

  componentDidMount() {
    this.props.browse();
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('click', () => {
    });
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  // componentWillUpdate(prevProps: any, prevState: any) {
  //   watchPropORStateChanges('App', prevProps, prevState, this.props, this.state);
  // }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevProps.folderPath !== this.props.folderPath) {
      this.props.browse();
    }
  }

  render() {
    const {folderPath, fileContextMenu, showHiddenFiles} = this.props;
    return (
      <div className="main">
        <TopMenubar
          folderPath={folderPath}
          showHiddenFiles={showHiddenFiles}
        />
        {this.renderMain()}
        <FileContextMenu {...fileContextMenu} />
      </div>
    );
  }

  renderMain() {
    const {res, layoutMode, files, showingFiles, showHiddenFiles} = this.props;
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

    const renderFiles = showHiddenFiles ? files : showingFiles;
    
    return (
      <>
        {layoutMode === 'grid' && this.renderGrid(renderFiles)}
        {layoutMode === 'list' && this.renderList(renderFiles)}
        {layoutMode === 'gallery' && this.renderGallery(renderFiles)}
      </>
    );
  }

  renderGrid(files: FileDesc[]) {
    const {currIndex} = this.props;
    return (
      <FilePreviewGridLayout
        currSelected={currIndex}
        files={files}
      />
    );
  }

  renderList(files: FileDesc[]) {
    const {currIndex} = this.props;
    return (
      <FilePreviewListLayout
        files={files}
        currSelected={currIndex}
      />
    );
  }

  renderGallery(files: FileDesc[]) {
    const {currIndex} = this.props;
    return (
      <FilePreviewGalleryLayout
        files={files}
        currIndex={currIndex}
      />
    )
  }
  
}

export default connectAppControl(App);