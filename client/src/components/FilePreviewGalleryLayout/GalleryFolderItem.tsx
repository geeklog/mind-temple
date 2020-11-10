import React from 'react';
import { FileDesc } from '../../models/file';
import Icon from '../Icon';
import GallerySubGridItem from './GallerySubGridItem';
import { AppProps, connectAppControl } from '../../models/app';

interface Props extends AppProps {
  file: FileDesc;
}

class GalleryFolderItem extends React.PureComponent<Props> {
  
  onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }

  render() {
    const {file} = this.props;
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

export default connectAppControl(GalleryFolderItem);
