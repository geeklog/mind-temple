import React, { PureComponent } from 'react';
import { FileDesc } from '../../models/file';
import classnames from 'classnames';
import Thumb from '../Thumb';
import { AppProps, connectAppControl } from '../../models/app';

interface Props extends AppProps {
  file: FileDesc;
  selected: boolean;
  index: number;
}

class FilePreviewListItem extends PureComponent<Props> {

  onContextMenu = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    const {files, currIndex, toggleFileContextMenu} = this.props;
    const file = files[currIndex];
    const x = event.pageX;
    const y = event.pageY;
    toggleFileContextMenu({visible: true, x, y, file});
  }

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

export default connectAppControl(FilePreviewListItem);
