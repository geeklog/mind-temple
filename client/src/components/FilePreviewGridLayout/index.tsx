import React from 'react';
import { AppControl } from '../../App';
import { FileDesc } from '../../models/file';
import FilePreviewGridItem from './FilePreviewGridItem';
import './index.scss';

interface Props {
  files: FileDesc[];
  currSelected: number;
  control: AppControl;
}

export default class FilePreviewGridLayout extends React.PureComponent<Props> {

  items: {[id: string]: FilePreviewGridItem | null} = {};

  render() {
    const {files, currSelected, control} = this.props;
    return (
      <div className="files-layout-grid">
        {files.map((file, i) =>
          <FilePreviewGridItem
            index={i}
            key={i}
            file={file}
            selected={i===currSelected}
            control={control}
          />
        )}
      </div>
    )
  }
}
