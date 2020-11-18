import React from 'react';
import './index.scss';
import * as service from '../../../services/fileService';
import classes from 'classnames';
import PlainTextEditor from '../../editors/PlainTextEditor';
import MarkdownEditor from '../../editors/MarkdownEditor';
import { AppProps, connectAppControl } from '../../../models/app';

class FileDetailPane extends React.PureComponent<AppProps> {

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
    const {currFile} = this.props;
    const file = currFile.file;
    const ext = service.resolveExtension(file.ext);
    const isDirectory = file.type === 'folder';
    const isImage = !isDirectory && service.isImage(ext);
    const isMarkdown = file.type === 'markdown';
    const isText = file.type === 'text';
    const isFile = !isImage && !isDirectory && !isText && !isMarkdown;
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
        className="file-detail-pane"
        onContextMenu={this.onContextMenu}
        onWheel={this.onWheel}
      >
        {isImage &&
          <div className="thumb">
            <img
              className="image"
              src={src}
              style={style}
              alt={file.name}
            />
          </div>
        }
        {isMarkdown &&
          <MarkdownEditor {...this.props} />
        }
        {isText &&
          <PlainTextEditor file={file} />
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

export default connectAppControl(FileDetailPane);
