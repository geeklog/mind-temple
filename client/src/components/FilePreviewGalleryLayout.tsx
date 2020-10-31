import React from 'react';
import { FileDesc } from '../models/file';
import { apiServer } from '../config';
import Icon from './Icon';
import { AppControl } from '../App';

export default class FilePreviewGalleryLayout extends React.PureComponent<{
  files: FileDesc[];
  currIndex: number;
  control: AppControl;
}> {
  render() {
    const {files, control, currIndex} = this.props;
    const file = files[currIndex];
    return (
      <div>
        <div className="image-box">
          <div className="btn btn-prev" onClick={control.selectPrev}>
            <Icon className="" name="chevron-left"/>
          </div>
          <div className="image-frame">
            <img
              className="image"
              src={`${apiServer}/file/${file.path}`}
              alt={file.name}
            />
            <div
              className="image-frame-overlay-left"
              onClick={control.selectPrev}
            />
            <div
              className="image-frame-overlay-right"
              onClick={control.selectNext}
            />
          </div>
          <div className="btn btn-next" onClick={control.selectNext}>
            <Icon name="chevron-right"/>
          </div>
        </div>
        <div className="gallery-dot-group">{
          files.map((file, i) => <div key={i} className={`gallery-dot ${i===currIndex ? 'selected' : ''}`} />)
        }</div>
      </div>
    );
  }
}
