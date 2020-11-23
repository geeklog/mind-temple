import React from 'react';
import classnames from 'classnames';
import Thumb from '../Thumb';
import { FileDesc } from '../../../models/file';
import FileNameLabel from '../FileNameLabel';

interface Props {
  index: number;
  file: FileDesc;
  selected: boolean;
  onClick: (file: FileDesc, index: number) => void;
  onDoubleClick: (file: FileDesc, index: number) => void;
  onContextMenu: (options: {visible: boolean, x: number, y: number, index: number, file: FileDesc}) => void;
  onFileNameChange: (newFileName: string, file: FileDesc, index: number) => void;
}

export default class FilePreviewGridItem extends React.PureComponent<Props> {

  onClick = (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();
    const {file, index} = this.props;
    this.props.onClick(file, index);
  }

  onDoubleClick = () => {
    const { file, index }: Props = this.props;
    this.props.onDoubleClick(file, index);
  }

  onContextMenu = (event: any) => {
    this.onClick(event);
    const {file, index} = this.props;
    event.preventDefault();
    event.stopPropagation();
    const x = event.pageX;
    const y = event.pageY;
    this.props.onContextMenu({visible: true, x, y, index, file});
  }

  onFileNameChange = (newFileName: string) => {
    const { file, index }: Props = this.props;
    if (file.name === newFileName) {
      return;
    }
    this.props.onFileNameChange(newFileName, file, index);
  }

  render() {
    const { file, selected,  }: Props = this.props;

    return (
      <div
        className={classnames(
          'grid-item',
          selected ? 'selected' : ''
        )}
        key={file.path}
        onClick={this.onClick}
        onDoubleClick={this.onDoubleClick}
        onContextMenu={this.onContextMenu}
      >
        <Thumb
          type="grid"
          size={80}
          selected={selected}
          file={file}
        />
        <FileNameLabel
          name={file.name}
          onChange={this.onFileNameChange}
        />
      </div>
    );
  }
}
