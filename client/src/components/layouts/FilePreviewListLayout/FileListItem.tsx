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

export default class FileListItem extends PureComponent<Props> {

  onContextMenu = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    const {file, index, onContextMenu} = this.props;
    const x = event.pageX;
    const y = event.pageY;
    onContextMenu({visible: true, x, y, index, file});
  }

  onClick = (event: any) => {
    const {file, index} = this.props;
    this.props.onClick(file, index);
  }

  onDoubleClick = () => {
    const {file, index} = this.props;
    this.props.onDoubleClick(file, index);
  }

  onDragStart = (event: React.DragEvent<HTMLLIElement>) => {
    const {file, index} = this.props;
    this.props.onDragStart(file, index, event);
  }

  onDragEnd = (event: React.DragEvent<HTMLLIElement>) => {
    const {file, index} = this.props;
    this.props.onDragEnd(file, index, event);
  }

  onDragOver = (event: React.DragEvent<HTMLLIElement>) => {
    event.preventDefault();
  }

  onDragEnter = (event: React.DragEvent<HTMLLIElement>) => {
    const {file, index} = this.props;
    this.props.onDragEnter(file, index, event);
  }

  onDragLeave = (event: React.DragEvent<HTMLLIElement>) => {
    const {file, index} = this.props;
    this.props.onDragLeave(file, index, event);
  }

  onDrop = () => {
    const {file, index} = this.props;
    this.props.onDrop(file, index);
  }

  onFileNameChange = (newFileName: string) => {
    const { file, index }: Props = this.props;
    if (file.name === newFileName) {
      return;
    }
    this.props.onFileNameChange(newFileName, file, index);
  }

  render() {
    const {file, selected, dragging, dropping, className, icon, text, isFileName} = this.props;
    const nodrop = dropping && (file.type !== 'folder' || selected || dragging);
    const selectedClassed = `${ selected ? 'selected' : ''}`;
    const draggingClassed = `${ dragging ? 'dragging' : ''}`;
    const droppingClassed = `${ dropping ? 'dropping' : ''}`;
    const nodropClassed = nodrop ? 'nodrop' : '';
    // const style = nodrop ? {cursor: 'no-drop'} : {};

    return (
      <li
        className={classnames(
          'cell',
          className,
          selectedClassed,
          draggingClassed,
          droppingClassed,
          nodropClassed
        )}
        // style={style}
        draggable={true}
        onClick={this.onClick}
        onContextMenu={this.onContextMenu}
        onDoubleClick={this.onDoubleClick}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onDragOver={this.onDragOver}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
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
