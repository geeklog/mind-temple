import React from 'react';
import { FileDesc } from '../../models/file';
import * as service from '../../services/fileService';
import classes from 'classnames';
import GalleryFolderItem from './GalleryFolderItem';
import { AppControl } from '../../App';

interface Props {
  file: FileDesc;
  control: AppControl;
}

export default class GalleryThumb extends React.PureComponent<Props> {
  
  render() {
    const {file, control} = this.props;
    let ext = service.resolveExtension(file.ext)
    let isDirectory = file.type === 'folder';
    let isImage = !isDirectory && service.isImage(ext);
    let isFile = !isImage && !isDirectory;
    const src = isImage
      ? service.file(file.path)
      : `filetypes/${ext}.svg`;
    const folderClassed = isDirectory ? 'folder' : '';

    let style;

    if (file.type === 'image') {
      style = {
        maxWidth: `calc(100vw - 200px)`,
        maxHeight: `calc(100vh - 100px)`
      }
    } else {
      style = {
        height: `calc(65vh - 100px)`,
        maxWidth: `calc(100vw - 200px)`,
        maxHeight: `calc(100vh - 100px)`
      }
    }

    return (
      <div
        className={classes('thumb', folderClassed)}
      >
        {isDirectory &&
          <GalleryFolderItem
            file={file}
            control={control}
          />
        }
        {isImage &&
          <>
            <img
              className="image"
              src={src}
              style={style}
              alt={file.name}
            />
            <div
              className="overlay-left"
              onClick={control.selectPrev}
            />
            <div
              className="overlay-right"
              onClick={control.selectNext}
            />
          </>
        }
        {isFile &&
          <>
            <img
              className={classes('preview-img', 'icon')}
              src={src}
              style={style}
              alt={file.name}
            />
            <div className="file-name">
              {file.name}
            </div>
          </>
        }
      </div>
    );
  }
}
