import React, { useState } from 'react';
import { FileDesc } from '../models/file';
import FilePreviewGridItem from './FilePreviewGridItem';

interface Props {
  files: FileDesc[];
  currSelected: number;
  setCurrSelected: (selected: number) => void;
  onOpen?: (index: number, file: FileDesc) => void 
}

function FilePreviewGridLayout(
  {files, onOpen, currSelected, setCurrSelected}: Props
) {

  const onSelected = (i: number) => {
    setCurrSelected(i);
  }

  return (
    <div className="files-layout-grid">
      {files.map((file, i) =>
        <FilePreviewGridItem
          file={file}
          selected={i===currSelected}
          onClick={() => onSelected(i)}
          onDoubleClick={() => onOpen?.(i, file)}
        />
      )}
    </div>
  )
}

export default FilePreviewGridLayout;
