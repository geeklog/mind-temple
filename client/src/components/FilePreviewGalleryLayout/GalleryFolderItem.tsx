import React from 'react';
import { FileDesc } from '../../models/file';
import Icon from '../Icon';
import { AppControl } from '../../App';
import GallerySubGridItem from './GallerySubGridItem';

interface Props {
  file: FileDesc;
  control: AppControl;
}

export default class GalleryFolderItem extends React.PureComponent<Props> {
  
  onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }

  render() {
    const {file, control} = this.props;
    return (
      <div
        className="folder"
        onWheel={this.onWheel}
      >
        <div className="folder-content">
          {file.subs?.map((subFile, i) =>
            <GallerySubGridItem
              index={i}
              key={i}
              file={subFile}
              selected={false}
              control={control}
            />
          )}
        </div>
        <div className="file-name">
          <Icon className="icon" name="folder" />
          <span> {file.name} </span>
        </div>
      </div>
    );
  }
}
