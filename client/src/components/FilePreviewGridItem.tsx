import React from 'react';
import { apiServer } from '../config';
import { FileDesc } from '../models/file';

interface Props {
  file: FileDesc;
  selected: boolean;
  className?: string;
  onClick?: (event: any) => void;
  onDoubleClick?: (event: any) => void;
}

function FilePreviewGridItem({
  file, className, selected, onClick, onDoubleClick
}: Props) {
  return (
    <div
      className={`${className || ''} ${selected && 'selected' || ''}`}
      key={file.path}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <span className="thumb-large">
        <img src={`${apiServer}/thumb/${file.path}?h=100`}></img>
      </span>
      <span className="file-name">
        {file.name}
      </span>
    </div>
  )
}

export default FilePreviewGridItem;
