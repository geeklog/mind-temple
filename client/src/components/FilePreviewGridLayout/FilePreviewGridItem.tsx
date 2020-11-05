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

  onClick = () => {
    const {index} = this.props;
    this.props.control.setCurrIndex(index);
  }

  onDoubleClick = () => {
    const { index, file }: Props = this.props;
    this.props.control.open(index, file);
  }

  render() {
    const { file, selected }: Props = this.props;

    return (
      <div
        className={classnames('grid-item', selected? 'selected' : '')}
        key={file.path}
        onClick={this.onClick}
        onDoubleClick={this.onDoubleClick}
      >
        <Thumb type="grid" size={80} selected={selected} file={file} />
        <div className="file-name">
          {file.name}
        </div>
      </div>
    )
  }

  
}
