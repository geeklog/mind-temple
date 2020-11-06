import React from 'react';
import { FileDesc } from '../../models/file';
import Icon from '../Icon';
import { AppControl } from '../../App';
import './index.scss';
import GalleryThumb from './GalleryThumb';

export default class FilePreviewGalleryLayout extends React.PureComponent<{
  files: FileDesc[];
  currIndex: number;
  control: AppControl;
}> {
  render() {
    const {files, control: {selectPrev, selectNext}, currIndex} = this.props;
    const file = files[currIndex];

    return (
      <div className="files-layout-gallery">
        <div className="image-control">
          <div className="btn btn-prev" onClick={selectPrev}>
            <Icon className="" name="chevron-left"/>
          </div>
          <div className="frame">
            <GalleryThumb file={file}/>
            <div
              className="overlay-left"
              onClick={selectPrev}
            />
            <div
              className="overlay-right"
              onClick={selectNext}
            />
          </div>
          <div className="btn btn-next" onClick={selectNext}>
            <Icon name="chevron-right"/>
          </div>
        </div>
        <div className="bottom-bar">
          <div className="dot-group">{
            files.map((file, i) => <div key={i} className={`dot ${i===currIndex ? 'selected' : ''}`} />)
          }</div>
        </div>
      </div>
    );
  }
}
