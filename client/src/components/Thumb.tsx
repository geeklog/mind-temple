import React from 'react';
import { FileDesc, ImageDesc } from '../models/file';
import { endsWith } from 'mikov/fn/op';
import { thumb } from '../services/fileService';
import classnames from 'classnames';

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif'];
const isImage = (s: string) => endsWith(IMAGE_EXTS)(s.toLowerCase());

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
    let aImage = isImage(ext);
    const src = aImage
      ? thumb(file, type==='grid'? {h:50} : {w:100})
      : `filetypes/${ext}.svg`;

    const img = file as ImageDesc;
    const classesSelected = (...classNames: string[]) =>
      classnames(...classNames, selected ? 'selected' : '');

    return (
      <div className={classesSelected(`${type}-item-thumb`)}>
        {aImage
          ? <img
              className={classesSelected('preview-img')}
              src={src}
              alt=""
              style={{
                width: img.width > img.height
                  ? `${size}px`
                  : (size * img.width / img.height) + 'px',
                height: img.height > img.width
                  ? `${size}px`
                  : (size * img.height / img.width) + 'px'
              }}
            />
          : <img
              className={classesSelected(
                'preview-img', 'svg-filetype-icon'
              )}
              src={src}
              alt=""
            />
        }
      </div>
    );
  }
}
