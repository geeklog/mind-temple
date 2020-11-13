import React from 'react';
import FilePreviewGridItem from './FilePreviewGridItem';
import './index.scss';
import { AppProps, connectAppControl } from '../../../models/app';
import { FileDesc } from '../../../models/file';

class FilePreviewGridLayout extends React.PureComponent<AppProps> {

  onGridItemClick =  (file: FileDesc, index: number) => {
    this.props.setCurrIndex(index);
  }

  onGridItemDoubleClick =  (file: FileDesc, index: number) => {
    this.props.open(file);
  }

  onGridItemContextMenu = (options: {
    visible: boolean; x: number; y: number; index: number; file: FileDesc;
  }) => {
    this.props.toggleFileContextMenu(options);
  }

  render() {
    const {showingFiles, currIndex} = this.props;
    return (
      <div className="files-layout-grid">
        {showingFiles.map((file, i) =>
          <FilePreviewGridItem
            index={i}
            key={i}
            file={file}
            selected={i === currIndex}
            onClick={this.onGridItemClick}
            onDoubleClick={this.onGridItemDoubleClick}
            onContextMenu={this.onGridItemContextMenu}
          />
        )}
      </div>
    );
  }
}

export default connectAppControl(FilePreviewGridLayout);
