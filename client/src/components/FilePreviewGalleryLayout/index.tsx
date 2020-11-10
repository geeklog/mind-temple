import React from 'react';
import Icon from '../Icon';
import './index.scss';
import GalleryThumb from './GalleryThumb';
import { AppProps, connectAppControl } from '../../models/app';

class FilePreviewGalleryLayout extends React.PureComponent<AppProps> {
  
  onContextMenu = (event: any) => {
    const {files, currIndex, toggleFileContextMenu} = this.props;
    const file = files[currIndex];
    event.preventDefault();
    event.stopPropagation();
    const x = event.pageX;
    const y = event.pageY;
    toggleFileContextMenu({visible: true, x, y, file});
  }
  
  onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const {selectNext, selectPrev} = this.props;
    if (event.deltaY > 0) {
      selectNext();
    } else if (event.deltaY < 0) {
      selectPrev();
    }
  }

  render() {
    const {showingFiles, currIndex, selectPrev, selectNext} = this.props;
    const file = showingFiles[currIndex];

    return (
      <div className="files-layout-gallery" onWheel={this.onWheel}>
        <div className="image-control">
          <div className="btn btn-prev" onClick={selectPrev}>
            <Icon className="" name="chevron-left"/>
          </div>
          <div
            className="frame"
            onContextMenu={this.onContextMenu}
          >
            <GalleryThumb file={file} />
          </div>
          <div className="btn btn-next" onClick={selectNext}>
            <Icon name="chevron-right"/>
          </div>
        </div>
        <div className="bottom-bar">
          <div className="dot-group">{
            showingFiles.map((file: any, i: number) => <div key={i} className={`dot ${i===currIndex ? 'selected' : ''}`} />)
          }</div>
        </div>
      </div>
    );
  }
}

export default connectAppControl(FilePreviewGalleryLayout);