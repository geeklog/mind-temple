import React from 'react';
import { AppControl } from '../App';
import { FileDesc } from '../models/file';
import { thumb } from '../services/fileService';

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

    return (
      <div
        className={`${className || ''}`}
        key={file.path}
        onClick={this.onClick}
        onDoubleClick={this.onDoubleClick}
      >
        <div className={`thumb ${selected ? 'selected' : ''}`}>
          <img src={thumb(file.path, {h:50})} alt=""></img>
        </div>
        <div className="file-name">
          {file.name}
        </div>
      </div>
    )
  }

  
}
