import React from 'react';
import './index.scss';
import FilePreviewGridLayout from '../layouts/FilePreviewGridLayout';
import FilePreviewListLayout from '../layouts/FilePreviewListLayout';
import FilePreviewGalleryLayout from '../layouts/FilePreviewGalleryLayout';
import TopMenubar from '../TopMenubar';
import FileContextMenu from '../layouts/FileContextMenu';
import { AppProps, connectAppControl } from '../../models/app';
import { LayoutMode } from '../../models/layout';
import Sidebar from '../Sidebar/index';
import FileDetailPane from '../layouts/FileDetailPane';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { watchPropORStateChanges } from './debug';

class App extends React.Component<AppProps> {

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  state = { hasError: false };

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
    // toast.error('whoa!', {position: 'bottom-right'});
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  // componentWillUpdate(prevProps: any, prevState: any) {
  //   watchPropORStateChanges('App', prevProps, prevState, this.props, this.state);
  // }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    return (
      <div className="app">
        <TopMenubar />
        <main className="main">
          <div className="container">
            <Sidebar {...this.props} />
            {this.renderMain()}
          </div>
        </main>
        <FileContextMenu />
        <ToastContainer />
      </div>
    );
  }

  renderMain() {
    const {currError, layoutMode, currFile} = this.props;
    if (this.state.hasError || currError) {
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
