import React from 'react';
import { FileDesc } from '../models/file';
import { AppControl } from '../App';
import { thumb } from '../services/fileService';
import Thumb from './Thumb';

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
          <li
            key={file.path}
            className={`${currSelected === i ? 'selected' : ''}`}
            onClick={() => control.setCurrIndex(i)}
            onDoubleClick={() => control.open(i, file)}
          >
            <Thumb type="list" selected={currSelected === i} file={file}/>
            <span>
              {file.name}
            </span>
          </li>
        )}
      </div>
    )
  }
}

