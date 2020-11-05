import React from 'react';
import { FileDesc } from '../../models/file';
import { AppControl } from '../../App';
import Thumb from '../Thumb';
import classnames from 'classnames';
import './index.scss';

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
            className={classnames('list-item', `${currSelected === i ? 'selected' : ''}`)}
            onClick={() => control.setCurrIndex(i)}
            onDoubleClick={() => control.open(i, file)}
          >
            <Thumb
              type="list"
              size={25}
              selected={currSelected === i}
              file={file}
            />
            <span>
              {file.name}
            </span>
          </li>
        )}
      </div>
    )
  }
}

