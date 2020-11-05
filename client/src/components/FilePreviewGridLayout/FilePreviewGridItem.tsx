import React from 'react';
import classnames from 'classnames';
import { AppControl } from '../../App';
import { FileDesc } from '../../models/file';
import Thumb from '../Thumb';

interface Props {
  index: number;
  file: FileDesc;
  selected: boolean;
  control: AppControl;
}

export default class FilePreviewGridItem extends React.PureComponent<Props> {

  onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const {index} = this.props;
    this.props.control.setCurrIndex(index);
  }

  onDoubleClick = () => {
    const { index, file }: Props = this.props;
    this.props.control.open(index, file);
  }

  onContextMenu = (event: any) => {
    const {control} = this.props;
    event.preventDefault();
    event.stopPropagation();
    const x = event.pageX;
    const y = event.pageY;
    control.toggleFileContextMenu(true, x, y);
  }

  render() {
    const { file, selected }: Props = this.props;

    return (
      <div
        className={classnames('grid-item', selected? 'selected' : '')}
        key={file.path}
        onClick={this.onClick}
        onDoubleClick={this.onDoubleClick}
        onContextMenu={this.onContextMenu}
      >
        <Thumb type="grid" size={80} selected={selected} file={file} />
        <div className="file-name">
          {file.name}
        </div>
      </div>
    )
  }

  
}
