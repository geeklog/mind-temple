import React, { PureComponent } from 'react';
import { FileItemProps } from './type';
import classnames from 'classnames';

export default class FileItem extends PureComponent<FileItemProps> {

  onContextMenu = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    const {file, index, onContextMenu} = this.props;
    const x = event.pageX;
    const y = event.pageY;
    onContextMenu({visible: true, x, y, index, file});
  }

  onClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const {file, index} = this.props;
    this.props.onClick(file, index);
  }

  onDoubleClick = () => {
    const {file, index} = this.props;
    this.props.onDoubleClick(file, index);
  }

  onDragStart = (event: React.DragEvent<HTMLElement>) => {
    const {file, index} = this.props;
    this.props.onDragStart(file, index, event);
  }

  onDragEnd = (event: React.DragEvent<HTMLElement>) => {
    const {file, index} = this.props;
    this.props.onDragEnd(file, index, event);
  }

  onDragOver = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
  }

  onDragEnter = (event: React.DragEvent<HTMLElement>) => {
    const {file, index} = this.props;
    this.props.onDragEnter(file, index, event);
  }

  onDragLeave = (event: React.DragEvent<HTMLElement>) => {
    const {file, index} = this.props;
    this.props.onDragLeave(file, index, event);
  }

  onDrop = () => {
    const {file, index} = this.props;
    this.props.onDrop(file, index);
  }

  render() {
    const {
      file,
      selected,
      dragging,
      dropping,
      className,
      children
    } = this.props;

    const nodrop = dropping && (file.type !== 'folder' || selected || dragging);
    const selectedClassed = `${ selected ? 'selected' : ''}`;
    const draggingClassed = `${ dragging ? 'dragging' : ''}`;
    const droppingClassed = `${ dropping ? 'dropping' : ''}`;
    const nodropClassed = nodrop ? 'nodrop' : '';

    return (
      <div
        className={classnames(
          ...(Array.isArray(className) ? className : [className]),
          selectedClassed,
          draggingClassed,
          droppingClassed,
          nodropClassed
        )}
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
        children={children}
      />
    );
  }
}
