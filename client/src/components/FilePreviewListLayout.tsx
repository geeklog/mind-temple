import React from 'react';
import { apiServer } from '../config';
import { FileDesc } from '../models/file';
import { AppControl } from '../App';

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
            <span className="thumb">
              <img src={`${apiServer}/thumb/${file.path}?w=100`}></img>
            </span>
            <span>
              {file.name}
            </span>
          </li>
        )}
      </div>
    )
  }
}

