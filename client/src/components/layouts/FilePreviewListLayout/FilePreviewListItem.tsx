import React, { PureComponent } from 'react';
import classnames from 'classnames';
import Thumb from '../Thumb';
import { FileItemProps } from '../type';

export default class FilePreviewListItem extends PureComponent<FileItemProps> {

  onContextMenu = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    const {file, index, onContextMenu} = this.props;
    const x = event.pageX;
    const y = event.pageY;
    onContextMenu({visible: true, x, y, index, file});
  }

  onClick = () => {
    const {index, file} = this.props;
    this.props.onClick(index, file);
  }

  onDoubleClick = () => {
    const {index, file} = this.props;
    this.props.onDoubleClick(index, file);
  }

  render() {
    const {file, selected} = this.props;
    const selectedClassed = `${ selected ? 'selected' : ''}`;
    return (
      <li
        className={classnames('cell', selectedClassed)}
        onClick={this.onClick}
        onContextMenu={this.onContextMenu}
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
    );
  }
}
