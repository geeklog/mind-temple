import React from 'react';
import { FileDesc, ImageDesc } from '../models/file';
import { endsWith } from 'mikov/fn/op';
import { thumb } from '../services/fileService';
import classes from 'classnames';

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif'];
const IS_IMAGE = (s: string) => endsWith(IMAGE_EXTS)(s.toLowerCase());

const supportExtensions = new Set([
  '7z', 'aac', 'ai', 'archive', 'arj', 'audio', 'avi', 'css', 'csv', 'dbf', 'doc', 'dwg', 'exe', 'fla', 'flac', 'gif', 'html', 'iso', 'jpg', 'js', 'json', 'mdf', 'mp2', 'mp3', 'mp4', 'mxf', 'nrg', 'pdf', 'png', 'ppt', 'psd', 'rar', 'rtf', 'svg', 'text', 'tiff', 'txt', 'video', 'wav', 'wma', 'xls', 'xml', 'zip'
]);

function resolveExtension(ext: string) {
  if (!ext) {
    ext = 'unknown';
  }
  if (ext.startsWith('.')) {
    ext = ext.replace('.', '');
  }
  if (ext === 'jpeg') {
    ext = 'jpg'
  }
  if (ext === 'md') {
    ext = 'txt'
  }
  if (ext === 'apk') {
    ext = 'zip'
  }
  if (ext === 'dmg') {
    ext = 'doc';
  }
  if (ext === 'docx') {
    ext = 'doc';
  }
  if (ext === 'xlsx') {
    ext = 'xls';
  }
  if (ext === 'br') {
    ext = 'zip'
  }
  if (!supportExtensions.has(ext)) {
    ext = 'unknown';
  }
  return ext;
}

interface Props {
  size: number;
  file: FileDesc;
  selected: boolean;
  type: 'grid' | 'list';
}

export default class Thumb extends React.PureComponent<Props> {
  render() {
    const {file, selected, type, size} = this.props;
    let ext = resolveExtension(file.ext)
    let isDirectory = file.type === 'directory';
    let isImage = !isDirectory && IS_IMAGE(ext);
    let isFile = !isImage && !isDirectory;
    const src = isImage
      ? thumb(file, type==='grid'? {h:size} : {w:size})
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
      <div className={classes('thumb', selectClassed, folderClassed)}>
        {isDirectory &&
          <div>
            <img
              className={classes('preview-img', 'svg-filetype-icon', 'offset-2')}
              src={src}
              alt=""
            />
            <img
              className={classes('preview-img', 'svg-filetype-icon', 'offset-1')}
              src={src}
              alt=""
            />
            <img
              className={classes('preview-img', 'svg-filetype-icon')}
              src={src}
              alt=""
            />
          </div>
        }
        {isImage &&
          <img
            className={classes('preview-img', selectClassed)}
            src={src}
            alt=""
            style={imgStyle}
          />
        }
        {isFile &&
          <img
            className={classes('preview-img', 'svg-filetype-icon')}
            src={src}
            alt=""
          />
        }
      </div>
    );
  }
}
