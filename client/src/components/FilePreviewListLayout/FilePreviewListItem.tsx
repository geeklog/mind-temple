import React, { Component } from 'react'
import { FileDesc } from '../../models/file'
import classnames from 'classnames';
import { AppControl } from '../../App';
import Thumb from '../Thumb';

interface Props {
  file: FileDesc;
  selected: boolean;
  control: AppControl;
  index: number;
}

export default class FilePreviewListItem extends Component<Props> {
  
  onClick = () => {
    const {control, index} = this.props;
    control.setCurrIndex(index);
  }

  onDoubleClick = () => {
    const {file, control} = this.props;
    control.open(file);
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
