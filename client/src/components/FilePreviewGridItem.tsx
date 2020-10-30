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
      className={`${className || ''}`}
      key={file.path}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
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

export default FilePreviewGridItem;
