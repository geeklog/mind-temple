import React from 'react';
import { FileDesc } from '../../models/file';
import FilePreviewGridItem from './FilePreviewGridItem';
import './index.scss';
import { AppProps, connectAppControl } from '../../models/app';

interface Props extends AppProps {
  files: FileDesc[];
  currSelected: number;
}

class FilePreviewGridLayout extends React.PureComponent<Props> {

  render() {
    const {files, currSelected} = this.props;
    return (
      <div className="files-layout-grid">
        {files.map((file, i) =>
          <FilePreviewGridItem
            index={i}
            key={i}
            file={file}
            selected={i===currSelected}
          />
        )}
      </div>
    )
  }
}

export default connectAppControl(FilePreviewGridLayout);
