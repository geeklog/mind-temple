import React from 'react';

import './index.scss';
import FilePreviewListItem from './FilePreviewListItem';
import { AppProps, connectAppControl } from '../../models/app';

class FilePreviewListLayout extends React.PureComponent<AppProps> {
  render() {
    const {files, currIndex} = this.props;
    
    return (
      <div className="files-layout-list">
        {files.map((file, i) =>
          <FilePreviewListItem
            key={i}
            file={file}
            index={i}
            selected={currIndex === i}
          />
        )}
      </div>
    )
  }
}

export default connectAppControl(FilePreviewListLayout);
