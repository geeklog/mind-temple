import React from 'react';
import './index.scss';
import FilePreviewGridLayout from '../layouts/FilePreviewGridLayout';
import FileListLayout from '../layouts/FilePreviewListLayout';
import FilePreviewGalleryLayout from '../layouts/FilePreviewGalleryLayout';
import TopMenubar from '../TopMenubar';
import FileContextMenu from '../layouts/FileContextMenu';
import { AppProps, connectAppControl } from '../../models/app';
import Sidebar from '../Sidebar/index';
import FileDetailPane from '../layouts/FileDetailPane';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import eventCenter from '../../services/eventCenter';
import hotkeys from '../../services/hotkeys';

class App extends React.Component<AppProps> {

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  state = { hasError: false };

  componentDidMount() {
    document.documentElement.className = '';
    document.documentElement.classList.add(`theme-${this.props.theme}`);
    document.documentElement.style.setProperty('--theme', this.props.theme);
    eventCenter.dispatchEvent('Evt:UpdateVar', {'--theme': this.props.theme});
    hotkeys.registerCommand('Cmd:ToggleTopbar', this.props.toggleTopbar);
    const root = document.documentElement;
    if (this.props.topbarOpened) {
      root.style.setProperty('--topbar-height', '45px');
      eventCenter.dispatchEvent('Evt:UpdateVar', {'--topbar-height': '45px'});
    } else {
      root.style.setProperty('--topbar-height', '0px');
      eventCenter.dispatchEvent('Evt:UpdateVar', {'--topbar-height': '0px'});
    }
  }

  componentDidUpdate() {
    const root = document.documentElement;
    if (this.props.topbarOpened) {
      root.style.setProperty('--topbar-height', '45px');
      eventCenter.dispatchEvent('Evt:UpdateVar', {'--topbar-height': '45px'});
    } else {
      root.style.setProperty('--topbar-height', '0px');
      eventCenter.dispatchEvent('Evt:UpdateVar', {'--topbar-height': '0px'});
    }
  }

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
        <FileContextMenu {...this.props}/>
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
          {layoutMode === 'list' && <FileListLayout />}
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
