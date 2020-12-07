import React from 'react';
import { FileDesc, ImageDesc } from '../../models/file';
import * as service from '../../services/fileService';
import classes from 'classnames';
import FolderIcon from '../controls/FolderIcon';
import { isImageExt, resolveExtensionForThumb } from '../../utils/extUtils';

interface Props {
  size: number;
  file: FileDesc;
  color?: string;
  selected: boolean;
  type: 'grid' | 'list';
}

export default class Thumb extends React.PureComponent<Props> {
  render() {
    const {color, file, selected, type, size} = this.props;
    let thumbExt = resolveExtensionForThumb(file.ext);
    let isDirectory = file.type === 'folder';
    let isImage = !isDirectory && isImageExt(file.ext);
    let isFile = !isImage && !isDirectory;
    const src = isImage
      ? service.thumb(file, type === 'grid' ? {h: size} : {w: size})
      : `filetypes/${thumbExt}.svg`;

    const img = file as ImageDesc;

    const selectClassed = selected ? 'selected' : '';
    const folderClassed = isDirectory ? 'folder' : '';

    const imgStyle = img && (
      img.width > img.height
        ? { width: `${size < img.width ? size : img.width }px`}
        : { height: `${size < img.height ? size : img.height }px`}
    );

    return (
      <div
        className={classes('thumb', selectClassed, folderClassed)}
        title={file.name}
      >
        {isDirectory &&
          <FolderIcon
            size={type === 'grid' ? 'medium' : 'small' }
            color={color}
          />
        }
        {isImage &&
          <img
            className={classes('preview-img', selectClassed)}
            src={src}
            alt={file.name}
            style={imgStyle}
          />
        }
        {isFile &&
          <img
            className={classes('preview-img', 'svg-filetype-icon')}
            src={src}
            alt={file.name}
          />
        }
      </div>
    );
  }
}
