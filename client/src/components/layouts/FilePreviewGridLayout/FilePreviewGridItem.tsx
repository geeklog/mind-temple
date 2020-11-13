import React from 'react';
import classnames from 'classnames';
import Thumb from '../Thumb';
import { FileDesc } from '../../../models/file';

interface Props {
  index: number;
  file: FileDesc;
  selected: boolean;
  onClick: (file: FileDesc, index: number) => void;
  onDoubleClick: (file: FileDesc, index: number) => void;
  onContextMenu: (options: {visible: boolean, x: number, y: number, index: number, file: FileDesc}) => void;
}

export default class FilePreviewGridItem extends React.PureComponent<Props> {

  onClick = (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const {file, index} = this.props;
    this.props.onClick(file, index);
  }

  onDoubleClick = () => {
    const { file, index }: Props = this.props;
    this.props.onDoubleClick(file, index);
  }

  onContextMenu = (event: any) => {
    this.onClick();
    const {file, index} = this.props;
    event.preventDefault();
    event.stopPropagation();
    const x = event.pageX;
    const y = event.pageY;
    this.props.onContextMenu({visible: true, x, y, index, file});
  }

  render() {
    const { file, selected }: Props = this.props;

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
        <div className="file-name">
          {file.name}
        </div>
      </div>
    );
  }
}
