import React from 'react';
import { FileDesc, ImageDesc } from '../../models/file';
import * as service from '../../services/fileService';
import classes from 'classnames';
import Icon from '../controls/Icon';

interface Props {
  size: number;
  file: FileDesc;
  selected: boolean;
  type: 'grid' | 'list';
}

export default class Thumb extends React.PureComponent<Props> {
  render() {
    const {file, selected, type, size} = this.props;
    let ext = service.resolveExtension(file.ext);
    let isDirectory = file.type === 'folder';
    let isImage = !isDirectory && service.isImage(ext);
    let isFile = !isImage && !isDirectory;
    const src = isImage
      ? service.thumb(file, type === 'grid' ? {h: size} : {w: size})
      : `filetypes/${ext}.svg`;

    const img = file as ImageDesc;

    const selectClassed = selected ? 'selected' : '';
    const folderClassed = isDirectory ? 'folder' : '';

    const imgStyle = img && (
      img.width > img.height
        ? { width: `${size}px`}
        : { height: `${size}px`}
    );

    return (
      <div
        className={classes('thumb', selectClassed, folderClassed)}
        title={file.name}
      >
        {isDirectory &&
          <Icon
            name="folder"
            className="svg-icon"
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
