import React from 'react';
import { FileDesc } from '../../models/file';
import FilePreviewGridItem from './FilePreviewGridItem';
import './index.scss';
import { AppProps, connectAppControl } from '../../models/app';

class FilePreviewGridLayout extends React.PureComponent<AppProps> {
  render() {
    const {showingFiles, currIndex} = this.props;
    return (
      <div className="files-layout-grid">
        {showingFiles.map((file, i) =>
          <FilePreviewGridItem
            index={i}
            key={i}
            file={file}
            selected={i===currIndex}
          />
        )}
      </div>
    )
  }
}

export default connectAppControl(FilePreviewGridLayout);
