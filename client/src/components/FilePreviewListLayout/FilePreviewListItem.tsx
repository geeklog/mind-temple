import React, { PureComponent } from 'react'
import { FileDesc } from '../../models/file'
import classnames from 'classnames';
import Thumb from '../Thumb';
import { AppProps, connectAppControl } from '../../models/app';

interface Props extends AppProps {
  file: FileDesc;
  selected: boolean;
  index: number;
}

class FilePreviewListItem extends PureComponent<Props> {
  
  onClick = () => {
    const {index, setCurrIndex} = this.props;
    setCurrIndex(index);
  }

  onDoubleClick = () => {
    const {file, open} = this.props;
    open(file);
  }

  render() {
    const {file, selected} = this.props;
    const selectedClassed = `${ selected ? 'selected' : ''}`;
    return (
      <li
        className={classnames('list-item', selectedClassed)}
        onClick={this.onClick}
        onDoubleClick={this.onDoubleClick}
      >
        <Thumb
          type="list"
          size={25}
          selected={selected}
          file={file}
        />
        <span>
          {file.name}
        </span>
      </li>
    )
  }
}

export default connectAppControl(FilePreviewListItem);