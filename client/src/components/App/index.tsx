import React from 'react';
import './index.scss';
import FilePreviewGridLayout from '../layouts/FilePreviewGridLayout';
import FilePreviewListLayout from '../layouts/FilePreviewListLayout';
import FilePreviewGalleryLayout from '../layouts/FilePreviewGalleryLayout';
import TopMenubar from '../TopMenubar';
import FileContextMenu from '../layouts/FileContextMenu';
import { AppProps, connectAppControl } from '../../models/app';
import Sidebar from '../Sidebar/index';
import FileDetailPane from '../layouts/FileDetailPane';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends React.Component<AppProps> {

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  state = { hasError: false };

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
