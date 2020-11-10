import React from 'react';
import classnames from 'classnames';
import { FileDesc } from '../../models/file';
import Thumb from '../Thumb';
import { connectAppControl, AppProps } from '../../models/app';

interface Props extends AppProps {
  index: number;
  file: FileDesc;
  selected: boolean;
}

class FilePreviewGridItem extends React.PureComponent<Props> {

  onClick = (event?: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const {index} = this.props;
    this.props.setCurrIndex(index);
  }

  onDoubleClick = () => {
    const { file }: Props = this.props;
    this.props.open(file);
  }

  onContextMenu = (event: any) => {
    this.onClick();
    const {file, toggleFileContextMenu} = this.props;
    event.preventDefault();
    event.stopPropagation();
    const x = event.pageX;
    const y = event.pageY;
    toggleFileContextMenu({visible: true, x, y, file});
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

export default connectAppControl(FilePreviewGridItem);
