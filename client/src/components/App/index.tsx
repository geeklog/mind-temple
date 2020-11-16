import React from 'react';
import './index.scss';
import FilePreviewGridLayout from '../layouts/FilePreviewGridLayout';
import FilePreviewListLayout from '../layouts/FilePreviewListLayout';
import FilePreviewGalleryLayout from '../layouts/FilePreviewGalleryLayout';
import TopMenubar from '../TopMenubar';
import FileContextMenu from '../layouts/FileContextMenu';
import { AppProps, connectAppControl } from '../../models/app';
import { LayoutMode } from '../../models/layout';
// import { watchPropORStateChanges } from './debug';
import Sidebar from '../Sidebar/index';
import FileDetailPane from '../layouts/FileDetailPane';

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
    this.props.navigateTo();
    document.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  // componentWillUpdate(prevProps: any, prevState: any) {
  //   watchPropORStateChanges('App', prevProps, prevState, this.props, this.state);
  // }

  render() {
    return (
      <div className="app">
        <Sidebar
          opened={this.props.sidebarOpened}
        />
        <main className="main">
          <TopMenubar />
          <div className="container">
            {this.renderMain()}
          </div>
        </main>
        <FileContextMenu />
      </div>
    );
  }

  renderMain() {
    const {currError, layoutMode, currFile} = this.props;
    if (currError) {
      return (
        <div className="error-msg">
          {currError}
        </div>
      );
    }
    if (!currFile.file) {
      return (
        <div className="error-msg">
          {currFile.path + ' Not found!'}
        </div>
      );
    }

    if (currFile.file.type === 'folder') {
      return (
        <>
          {layoutMode === 'grid' && <FilePreviewGridLayout />}
          {layoutMode === 'list' && <FilePreviewListLayout />}
          {layoutMode === 'gallery' && <FilePreviewGalleryLayout />}
        </>
      );
    } else {
      return (
        <FileDetailPane />
      );
    }
  }

}

export default connectAppControl(App);
