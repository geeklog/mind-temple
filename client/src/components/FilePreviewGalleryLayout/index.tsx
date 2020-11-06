import React from 'react';
import { FileDesc } from '../../models/file';
import Icon from '../Icon';
import { AppControl } from '../../App';
import './index.scss';
import GalleryThumb from './GalleryThumb';

interface Props {
  files: FileDesc[];
  currIndex: number;
  control: AppControl;
}

export default class FilePreviewGalleryLayout extends React.PureComponent<Props> {
  
  onContextMenu = (event: any) => {
    const {files, currIndex, control} = this.props;
    const file = files[currIndex];
    event.preventDefault();
    event.stopPropagation();
    const x = event.pageX;
    const y = event.pageY;
    control.toggleFileContextMenu(true, x, y, file);
  }

  render() {
    const {files, control, currIndex} = this.props;
    const file = files[currIndex];

    return (
      <div className="files-layout-gallery">
        <div className="image-control">
          <div className="btn btn-prev" onClick={control.selectPrev}>
            <Icon className="" name="chevron-left"/>
          </div>
          <div
            className="frame"
            onContextMenu={this.onContextMenu}
          >
            <GalleryThumb file={file}/>
            <div
              className="overlay-left"
              onClick={control.selectPrev}
            />
            <div
              className="overlay-right"
              onClick={control.selectNext}
            />
          </div>
          <div className="btn btn-next" onClick={control.selectNext}>
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
