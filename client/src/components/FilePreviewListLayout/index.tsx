import React from 'react';

import { FileDesc } from '../../models/file';
import { AppControl } from '../../App';
import './index.scss';
import FilePreviewListItem from './FilePreviewListItem';

interface Props {
  files: FileDesc[];
  currSelected: number;
  control: AppControl
}

export default class FilePreviewListLayout extends React.PureComponent<Props> {
  render() {
    const {files, currSelected, control} = this.props;
    
    return (
      <div className="files-layout-list">
        {files.map((file, i) =>
          <FilePreviewListItem
            key={i}
            file={file}
            control={control}
            index={i}
            selected={currSelected === i}
          />
        )}
      </div>
    )
  }
}

