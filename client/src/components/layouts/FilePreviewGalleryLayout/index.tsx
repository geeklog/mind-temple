import React from 'react';
import './index.scss';
import * as service from '../../../services/fileService';
import classes from 'classnames';
import GalleryFolderItem from './GalleryFolderItem';
import { AppProps, connectAppControl } from '../../../models/app';
import { FileDesc } from '../../../models/file';
import PlainTextPreview from './PlainTextPreview';

class FilePreviewGalleryLayout extends React.PureComponent<AppProps> {

  onContextMenu = (event: any) => {
    const {files, currIndex, toggleFileContextMenu} = this.props;
    const file = files[currIndex];
    event.preventDefault();
    event.stopPropagation();
    const x = event.pageX;
    const y = event.pageY;
    toggleFileContextMenu({visible: true, x, y, file});
  }

  onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const {selectNext, selectPrev} = this.props;
    if (event.deltaY > 0) {
      selectNext();
    } else if (event.deltaY < 0) {
      selectPrev();
    }
  }

  render() {
    const {showingFiles, currIndex} = this.props;
    const file = showingFiles[currIndex];

    return (
      <div className="files-layout-gallery" onWheel={this.onWheel}>
        {this.renderSlide(file)}
        <div className="bottom-bar">
          <div className="dot-group">{
            showingFiles.map((file: any, i: number) => <div key={i} className={`dot ${i === currIndex ? 'selected' : ''}`} />)
          }</div>
        </div>
      </div>
    );
  }

  renderSlide(file: FileDesc) {
    const {selectPrev, selectNext} = this.props;
    const ext = service.resolveExtension(file.ext);
    const isDirectory = file.type === 'folder';
    const isImage = !isDirectory && service.isImage(ext);
    const isText = file.type === 'text';
    const isFile = !isImage && !isDirectory && !isText;
    const src = isImage
      ? service.file(file.path)
      : `filetypes/${ext}.svg`;

    let style;

    if (file.type === 'image') {
      style = {
        maxWidth: `calc(100vw - 40px)`,
        maxHeight: `calc(95vh - 50px)`
      };
    } else {
      style = {
        height: `calc(65vh - 100px)`,
        maxWidth: `calc(100vw - 200px)`,
        maxHeight: `calc(100vh - 100px)`
      };
    }

    return (
      <div
        className="slide"
        onContextMenu={this.onContextMenu}
      >
        {isDirectory &&
          <div className='thumb'>
            <GalleryFolderItem
              file={file}
            />
            <div className="file-name">
              {file.name}
            </div>
          </div>
        }
        {isImage &&
          // <div className="btn btn-prev" onClick={selectPrev}>
          //   <Icon className="" name="chevron-left"/>
          // </div>
          // <div className="btn btn-next" onClick={selectNext}>
          //   <Icon name="chevron-right"/>
          // </div>
          <div className="frame">
            <img
              className="image"
              src={src}
              style={style}
              alt={file.name}
            />
            <div
              className="overlay-left"
              onClick={selectPrev}
            />
            <div
              className="overlay-right"
              onClick={selectNext}
            />
          </div>
        }
        {isText &&
          <div className='thumb'>
            <PlainTextPreview file={file} />
            <div className="file-name">
              {file.name}
            </div>
          </div>
        }
        {isFile &&
          <div className='thumb'>
            <img
              className={classes('preview-img', 'icon')}
              src={src}
              style={style}
              alt={file.name}
            />
            <div className="file-name">
              {file.name}
            </div>
          </div>
        }
      </div>
    );
  }
}

export default connectAppControl(FilePreviewGalleryLayout);
