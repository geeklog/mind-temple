import React, { PureComponent } from 'react';
import classnames from 'classnames';
import Thumb from '../Thumb';
import { FileItemProps } from '../type';
import Label from '../../controls/Label/index';

interface Props extends FileItemProps {
  className?: string;
  icon?: number;
  text: string;
}

export default class FilePreviewListItem extends PureComponent<Props> {

  onContextMenu = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    const {file, index, onContextMenu} = this.props;
    const x = event.pageX;
    const y = event.pageY;
    onContextMenu({visible: true, x, y, index, file});
  }

  onClick = () => {
    const {file, index} = this.props;
    this.props.onClick(file, index);
  }

  onDoubleClick = () => {
    const {file, index} = this.props;
    this.props.onDoubleClick(file, index);
  }

  render() {
    const {file, selected, className, icon, text} = this.props;
    const selectedClassed = `${ selected ? 'selected' : ''}`;
    return (
      <li
        className={classnames(
          'cell',
          className,
          selectedClassed
        )}
        onClick={this.onClick}
        onContextMenu={this.onContextMenu}
        onDoubleClick={this.onDoubleClick}
      >
        {icon &&
          <Thumb
            type="list"
            size={icon}
            selected={selected}
            file={file}
          />
        }
        <Label text={text} />
      </li>
    );
  }
}
