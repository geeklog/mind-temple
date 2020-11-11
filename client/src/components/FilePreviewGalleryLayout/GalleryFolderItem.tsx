import React from 'react';
import { FileDesc } from '../../models/file';
import Icon from '../controls/Icon';
import GallerySubGridItem from './GallerySubGridItem';
import { AppProps, connectAppControl } from '../../models/app';
import { blockWheelWithin } from '../../utils/domUtils';

interface Props extends AppProps {
  file: FileDesc;
}

class GalleryFolderItem extends React.PureComponent<Props> {

  div: HTMLDivElement | null = null;
  
  onWheel = blockWheelWithin(() => this.div);

  onFolderSubGridItemClick = (index: number) => {
    const {file, setFolderCurrIndex} = this.props;
    setFolderCurrIndex({
      currIndex: index,
      folderPath: file.path
    });
  }

  render() {
    const {file} = this.props;
    const subCurrIndex = this.props.folders[file.path]?.currIndex ?? 0;
    return (
      <div
        className="folder"
        ref={(ref) => {this.div = ref}}
        onWheel={this.onWheel}
      >
        <div className="folder-content">
          {file.subs?.map((subFile, i) =>
            <GallerySubGridItem
              index={i}
              key={i}
              file={subFile}
              selected={i===subCurrIndex}
              onClick={this.onFolderSubGridItemClick}
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
