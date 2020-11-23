import React, { PureComponent } from 'react';
import classnames from 'classnames';
import Thumb from '../Thumb';
import { FileItemProps } from '../type';
import Label from '../../controls/Label/index';
import FileNameLabel from '../FileNameLabel';
import { FileDesc } from '../../../models/file';

interface Props extends FileItemProps {
  className?: string;
  icon?: number;
  text: string;
  isFileName?: boolean;
  onFileNameChange?: (newFileName: string, file: FileDesc, index: number) => void;
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

  onClick = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    const {file, index} = this.props;
    this.props.onClick(file, index);
  }

  onDoubleClick = () => {
    const {file, index} = this.props;
    this.props.onDoubleClick(file, index);
  }

  onFileNameChange = (newFileName: string) => {
    const { file, index }: Props = this.props;
    if (file.name === newFileName) {
      return;
    }
    this.props.onFileNameChange(newFileName, file, index);
  }

  render() {
    const {file, selected, className, icon, text, isFileName} = this.props;
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
        {
          isFileName
            ? <FileNameLabel
                name={file.name}
                onChange={this.onFileNameChange}
              />
            : <Label text={text} />
        }
      </li>
    );
  }
}
