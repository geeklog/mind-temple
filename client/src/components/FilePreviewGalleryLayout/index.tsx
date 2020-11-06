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
  
  onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const {control} = this.props;
    if (event.deltaY > 0) {
      control.selectNext();
    } else if (event.deltaY < 0) {
      control.selectPrev();
    }
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
            onWheel={this.onWheel}
          >
            <GalleryThumb file={file} control={control} />
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
