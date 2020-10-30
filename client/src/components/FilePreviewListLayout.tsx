import React from 'react';
import { apiServer } from '../config';
import { FileDesc } from '../models/file';

interface Props {
  files: FileDesc[];
  currSelected: number;
  setCurrSelected: (selected: number) => void;
  onOpen?: (index: number, file: FileDesc) => void 
}

function FilePreviewListLayout(
  {files, onOpen, currSelected, setCurrSelected}: Props
) {

  return (
    <div className="files-layout-list">
      {files.map((file, i) =>
        <li
          key={file.path}
          className={`${currSelected === i ? 'selected' : ''}`}
          onClick={() => setCurrSelected?.(i)}
          onDoubleClick={() => onOpen?.(i, file)}
        >
          <span className="thumb">
            <img src={`${apiServer}/thumb/${file.path}?w=100`}></img>
          </span>
          <span>
            {file.name}
          </span>
        </li>
      )}
    </div>

  )
}

export default FilePreviewListLayout;
