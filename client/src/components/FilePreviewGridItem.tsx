import React from 'react';
import { AppControl } from '../App';
import { apiServer } from '../config';
import { FileDesc } from '../models/file';

interface Props {
  index: number;
  file: FileDesc;
  selected: boolean;
  className?: string;
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
    const { file, className, selected }: Props = this.props;

    console.log('render FilePreviewGridItem');
    return (
      <div
        className={`${className || ''}`}
        key={file.path}
        onClick={this.onClick}
        onDoubleClick={this.onDoubleClick}
      >
        <div className={`thumb ${selected && 'selected' || ''}`}>
          <img src={`${apiServer}/thumb/${file.path}?h=100`}></img>
        </div>
        <div className="file-name">
          {file.name}
        </div>
      </div>
    )
  }

  
}
