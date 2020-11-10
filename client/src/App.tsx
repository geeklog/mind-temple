import React from 'react';
import './styles/App.scss';
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

  componentDidUpdate(prevProps: AppProps, prevState: AppProps) {
    if (prevProps.currPath !== this.props.currPath) {
      this.props.browse();
    }
  }

  render() {
    return (
      <div className="main">
        <TopMenubar />
        {this.renderMain()}
        <FileContextMenu />
      </div>
    );
  }

  renderMain() {
    const {res, layoutMode} = this.props;
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

    return (
      <>
        {layoutMode === 'grid' && <FilePreviewGridLayout />}
        {layoutMode === 'list' && <FilePreviewListLayout />}
        {layoutMode === 'gallery' && <FilePreviewGalleryLayout />}
      </>
    );
  }
  
}

export default connectAppControl(App);